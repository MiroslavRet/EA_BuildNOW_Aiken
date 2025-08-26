import {
  LucidEvolution,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
  Data,
  Constr,
  UTxO,
  Assets,
  PolicyId,
  Unit,
} from "@lucid-evolution/lucid";

// Types matching the Aiken validator
export type CFdatum = {
  campaign_id: bigint;
  title: string;
  goal: bigint;
  creator: string; // VerificationKeyHash
  backer: string; // VerificationKeyHash  
  amount: bigint;
  deadline: bigint;
  current_funds: bigint;
};

export type CFredeemer = {
  campaign_id: bigint;
  action: bigint; // 0: Cancel, 1: Support, 2: Claims
  amount: bigint;
  backer: string; // VerificationKeyHash
};

// Data encoding/decoding functions
export const CFdatumSchema = Data.Object({
  campaign_id: Data.Integer(),
  title: Data.Bytes(),
  goal: Data.Integer(),
  creator: Data.Bytes(),
  backer: Data.Bytes(),
  amount: Data.Integer(),
  deadline: Data.Integer(),
  current_funds: Data.Integer(),
});

export const CFredeemerSchema = Data.Object({
  campaign_id: Data.Integer(),
  action: Data.Integer(),
  amount: Data.Integer(),
  backer: Data.Bytes(),
});

export class CrowdfundingContract {
  private lucid: LucidEvolution;
  private validator: SpendingValidator;

  constructor(lucid: LucidEvolution, validator: SpendingValidator) {
    this.lucid = lucid;
    this.validator = validator;
  }

  // Create a new campaign
  async createCampaign(
    campaignId: bigint,
    title: string,
    goal: bigint,
    deadline: bigint,
    initialDeposit: bigint
  ): Promise<TxHash> {
    const creatorPkh = this.lucid.utils.getAddressDetails(
      await this.lucid.wallet().address()
    ).paymentCredential?.hash;

    if (!creatorPkh) throw new Error("Could not get creator payment key hash");

    const datum: CFdatum = {
      campaign_id: campaignId,
      title: title,
      goal: goal,
      creator: creatorPkh,
      backer: "", // Empty for initial creation
      amount: 0n,
      deadline: deadline,
      current_funds: 0n,
    };

    const contractAddress = this.lucid.utils.validatorToAddress(this.validator);

    const tx = await this.lucid
      .newTx()
      .pay.ToAddressWithData(
        contractAddress,
        { kind: "inline", value: Data.to(datum, CFdatumSchema) },
        { lovelace: initialDeposit }
      )
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return signedTx.submit();
  }

  // Support a campaign
  async supportCampaign(
    campaignUtxo: UTxO,
    supportAmount: bigint,
    backerPkh: string
  ): Promise<TxHash> {
    const currentDatum = Data.from(
      campaignUtxo.datum!,
      CFdatumSchema
    ) as CFdatum;

    const newDatum: CFdatum = {
      ...currentDatum,
      backer: backerPkh,
      amount: supportAmount,
      current_funds: currentDatum.current_funds + supportAmount,
    };

    const redeemer: CFredeemer = {
      campaign_id: currentDatum.campaign_id,
      action: 1n, // Support action
      amount: supportAmount,
      backer: backerPkh,
    };

    const contractAddress = this.lucid.utils.validatorToAddress(this.validator);

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer, CFredeemerSchema))
      .pay.ToAddressWithData(
        contractAddress,
        { kind: "inline", value: Data.to(newDatum, CFdatumSchema) },
        { lovelace: campaignUtxo.assets.lovelace + supportAmount }
      )
      .addSigner(await this.lucid.wallet().address())
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return signedTx.submit();
  }

  // Cancel a campaign (creator only)
  async cancelCampaign(campaignUtxo: UTxO): Promise<TxHash> {
    const currentDatum = Data.from(
      campaignUtxo.datum!,
      CFdatumSchema
    ) as CFdatum;

    const redeemer: CFredeemer = {
      campaign_id: currentDatum.campaign_id,
      action: 0n, // Cancel action
      amount: 0n,
      backer: "",
    };

    const creatorAddress = await this.lucid.wallet().address();

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer, CFredeemerSchema))
      .pay.ToAddress(creatorAddress, campaignUtxo.assets)
      .addSigner(creatorAddress)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return signedTx.submit();
  }

  // Claim funds (when goal is reached)
  async claimFunds(campaignUtxo: UTxO): Promise<TxHash> {
    const currentDatum = Data.from(
      campaignUtxo.datum!,
      CFdatumSchema
    ) as CFdatum;

    const redeemer: CFredeemer = {
      campaign_id: currentDatum.campaign_id,
      action: 2n, // Claims action
      amount: 0n,
      backer: "",
    };

    const creatorAddress = await this.lucid.wallet().address();

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer, CFredeemerSchema))
      .pay.ToAddress(creatorAddress, campaignUtxo.assets)
      .addSigner(creatorAddress)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return signedTx.submit();
  }

  // Get campaign UTxOs
  async getCampaignUtxos(): Promise<UTxO[]> {
    const contractAddress = this.lucid.utils.validatorToAddress(this.validator);
    return this.lucid.utxosAt(contractAddress);
  }

  // Get specific campaign by ID
  async getCampaignById(campaignId: bigint): Promise<UTxO | null> {
    const utxos = await this.getCampaignUtxos();
    
    for (const utxo of utxos) {
      if (utxo.datum) {
        try {
          const datum = Data.from(utxo.datum, CFdatumSchema) as CFdatum;
          if (datum.campaign_id === campaignId) {
            return utxo;
          }
        } catch (e) {
          // Skip invalid datums
          continue;
        }
      }
    }
    
    return null;
  }

  // Helper to check if campaign goal is reached
  isGoalReached(datum: CFdatum): boolean {
    return datum.current_funds >= datum.goal;
  }

  // Helper to check if campaign is expired
  isExpired(datum: CFdatum): boolean {
    const currentTime = BigInt(Date.now());
    return currentTime > datum.deadline;
  }

  // Helper to get campaign status
  getCampaignStatus(datum: CFdatum): 'active' | 'funded' | 'expired' | 'cancelled' {
    if (this.isGoalReached(datum)) return 'funded';
    if (this.isExpired(datum)) return 'expired';
    return 'active';
  }
}

// Factory function to create contract instance
export async function createCrowdfundingContract(
  lucid: LucidEvolution,
  validatorScript: string
): Promise<CrowdfundingContract> {
  const validator: SpendingValidator = {
    type: "PlutusV3",
    script: validatorScript,
  };

  return new CrowdfundingContract(lucid, validator);
}

// Utility functions for working with the contract
export const CrowdfundingUtils = {
  // Convert ADA to lovelace
  adaToLovelace: (ada: number): bigint => BigInt(Math.floor(ada * 1_000_000)),
  
  // Convert lovelace to ADA
  lovelaceToAda: (lovelace: bigint): number => Number(lovelace) / 1_000_000,
  
  // Create campaign ID from timestamp and creator
  createCampaignId: (creatorPkh: string): bigint => {
    const timestamp = BigInt(Date.now());
    const hash = creatorPkh.slice(0, 8); // Use first 8 chars of PKH
    return timestamp + BigInt(parseInt(hash, 16));
  },
  
  // Format campaign title for blockchain storage
  formatTitle: (title: string): string => {
    return title.slice(0, 100); // Limit to 100 characters
  },
  
  // Calculate deadline timestamp
  calculateDeadline: (daysFromNow: number): bigint => {
    const now = Date.now();
    const deadline = now + (daysFromNow * 24 * 60 * 60 * 1000);
    return BigInt(deadline);
  },
};