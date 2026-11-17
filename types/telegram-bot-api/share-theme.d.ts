import type { UniqueGift, UniqueGiftBackdropColors } from "./payment.js";

/** This object describes an emoji shown in a chat share theme. It can be one of
 *
 * - EmojiTypeEmoji
 * - EmojiTypeCustomEmoji
 */
export type EmojiType = EmojiTypeEmoji | EmojiTypeCustomEmoji;
/** A regular emoji. */
export interface EmojiTypeEmoji {
    /** Type of the emoji, always “emoji” */
    type: "emoji";
    /** The emoji */
    emoji: string;
}
/** A custom emoji. */
export interface EmojiTypeCustomEmoji {
    /** Type of the emoji, always “custom_emoji” */
    type: "custom_emoji";
    /** Identifier of the custom emoji. Use getCustomEmojiStickers to get full information about the sticker. */
    custom_emoji_id: string;
}
/** Describes the theme of the screen for sharing a link to a user or a chat. It can be one of
 *
 * - ChatShareThemeEmoji
 * - ChatShareThemeUniqueGift
 */
export type ChatShareTheme = ChatShareThemeEmoji | ChatShareThemeUniqueGift;
/** The theme is defined by an emoji. */
export interface ChatShareThemeEmoji {
    /** Type of the theme, always “emoji” */
    type: "emoji";
    /** The emoji; 0-6 regular or custom emoji */
    emojis: EmojiType[];
    /** Identifier of the backdrop used as the background; omitted if the default background is used. Use getChatShareThemeBackdrops to get details about the backdrop. */
    background_backdrop_id?: number;
}
/** The theme is defined by a unique gift. */
export interface ChatShareThemeUniqueGift {
    /** Type of the theme, always “unique_gift” */
    type: "unique_gift";
    /** The gift */
    gift: UniqueGift;
}
/** This object describes a backdrop which can be used as the background of a chat share theme. */
export interface ChatShareThemeBackdrop {
    /** Unique identifier of the backdrop */
    id: number;
    /** Name of the backdrop */
    name: string;
    /** Colors of the backdrop */
    colors: UniqueGiftBackdropColors;
}
/** This object represents the list of backdrops, which can be used as the background of a theme of the screen for sharing a link to a user or a chat. */
export interface ChatShareThemeBackdrops {
    /** The list of backdrops */
    backdrops: ChatShareThemeBackdrop[];
}
