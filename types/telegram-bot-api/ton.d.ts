import type { AreaPosition } from "./story.js";
import type { UniqueGift } from "./payment.js";

/** Describes a service message about a transfer with a TON wallet. */
export interface TonWalletTransfer {
    /** Unique identifier of the transaction; may be empty if the transfer hasn't been sent yet */
    transaction_id: string;
    /** Address of the transfer peer in the TON blockchain */
    peer_address: string;
    /** The amount of transferred cryptocurrency, in the smallest units of the cryptocurrency, as a decimal number; negative for outgoing transfers */
    amount: string;
    /** Comment added to the transfer; omitted if the comment is encrypted */
    comment?: string;
}

/** This object describes a TON NFT shown on a wallet card. */
export interface TonNft {
    /** Address of the NFT */
    address: string;
    /** Address of the collection to which the NFT belongs; omitted if unknown */
    collection_address?: string;
    /** Index of the NFT among all NFTs from the collection as a decimal number */
    index: string;
    /** Name of the NFT */
    name: string;
    /** Description of the NFT */
    description: string;
    /** Attributes of the NFT */
    attributes?: TonNftAttribute[];
    /** The unique gift corresponding to the NFT */
    gift?: UniqueGift;
}

/** This object describes an attribute of a TON NFT. */
export interface TonNftAttribute {
    /** Trait type of the attribute */
    trait_type: string;
    /** Value of the attribute */
    value: string;
}

/** This object describes a sticker placed on a TON wallet card. */
export interface TonWalletCardSticker {
    /** Position of the sticker on the card */
    position: AreaPosition;
    /** The NFT shown as the sticker */
    nft: TonNft;
}

/** This object describes the TON wallet card of a user shown in a chat and in bot widgets. */
export interface TonWalletCard {
    /** Address of the wallet */
    address: string;
    /** Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number */
    amount: string;
    /** Stickers placed on the card */
    stickers: TonWalletCardSticker[];
    /** Address of the NFT of one of the stickers, whose colors must be used for the card background; omitted if the default background must be used */
    background_nft_address?: string;
}
