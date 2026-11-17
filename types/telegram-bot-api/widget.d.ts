import type { Chat, User } from "./manage.js";
import type { MessageEntity, ParseMode } from "./message.js";
import type { TonWalletCard } from "./ton.js";

/** This object describes an HTML widget. */
export interface Widget {
    /** Unique identifier of the shared widget, which can be used to send the widget again using the method sendSharedWidget; omitted if the widget isn't shared */
    id?: string;
    /** Width of the widget in logical pixels; omitted if the widget must occupy the whole width of the message bubble */
    width?: number;
    /** Height of the widget in logical pixels; omitted if the height of the widget isn't fixed */
    height?: number;
    /** HTML code of the widget */
    html: string;
    /** Public data of the widget, which is available wherever the widget is shown. All messages with a shared widget have the same public data. */
    public_data?: string;
    /** Data of the widget, which is specific to the message */
    chat_data?: string;
}

/** The wallet that sent a query or signed data from a widget. */
export interface WidgetQueryWallet {
    /** Address of the wallet */
    address: string;
    /** Balance of the wallet, in the smallest units of the cryptocurrency, as a decimal number */
    amount: string;
    /** Hex-encoded public key of the wallet; omitted if unknown */
    public_key?: string;
    /** Base64-encoded serialized StateInit of the wallet contract; omitted if and only if public_key is omitted */
    state_init?: string;
}

/** The query contains only data for the bot. */
export interface WidgetQueryTypeData {
    /** Type of the query, always “data” */
    type: "data";
    /** TON wallet card of the user who sent the query, if it was sent to the bot along with the query */
    wallet_card?: TonWalletCard;
}

/** The query contains data signed by a TON wallet of the user. */
export interface WidgetQueryTypeSignData {
    /** Type of the query, always “sign_data” */
    type: "sign_data";
    /** The wallet that signed the data */
    wallet: WidgetQueryWallet;
    /** JSON-serialized signed data */
    sign_data: string;
}

/** The query is a notification about a transaction sent from a TON wallet of the user. */
export interface WidgetQueryTypeSentTransaction {
    /** Type of the query, always “sent_transaction” */
    type: "sent_transaction";
    /** The wallet from which the transaction was sent */
    wallet: WidgetQueryWallet;
    /** Value of msg_hash of the transaction */
    msg_hash: string;
}

/** Describes the type of a query from a widget. It can be one of
 *
 * - WidgetQueryTypeData
 * - WidgetQueryTypeSignData
 * - WidgetQueryTypeSentTransaction
 */
export type WidgetQueryType = WidgetQueryTypeData | WidgetQueryTypeSignData | WidgetQueryTypeSentTransaction;

/** This object represents an incoming query from a widget in a message sent by the bot or via the bot. Use answerWidgetQuery to answer the query. Each user can send at most 5 queries per 5 seconds to the bot from all its widgets. */
export interface WidgetQuery {
    /** Unique identifier for this query */
    id: string;
    /** Sender */
    from: User;
    /** Chat with the message containing the widget; omitted if the widget is in an inline message */
    chat?: Chat;
    /** Identifier of the message containing the widget; omitted if the widget is in an inline message */
    message_id?: number;
    /** Identifier of the inline message containing the widget */
    inline_message_id?: string;
    /** Global identifier, uniquely corresponding to the chat to which the message with the widget was sent */
    chat_instance: string;
    /** For widgets in inline messages, type of the chat to which the message was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. */
    chat_type?: string;
    /** Type of the query */
    type: WidgetQueryType;
    /** Data of the query, 1-64 bytes */
    data: string;
    /** Unique identifier of the shared widget, which sent the query; omitted if the widget isn't shared */
    widget_id?: string;
}

/** This object represents an incoming query from a forwarded message with a shared widget created by the bot. Use answerWidgetQuery to answer the query. Each user can send at most 5 queries per 5 seconds to the bot from all its widgets. */
export interface SharedWidgetQuery {
    /** Unique identifier for this query */
    id: string;
    /** Sender */
    from: User;
    /** Type of the query */
    type: WidgetQueryType;
    /** Data of the query, 1-64 bytes */
    data: string;
    /** Unique identifier of the shared widget, which sent the query */
    widget_id: string;
}

/** Represents the content of a widget message to be sent as the result of an inline query, a guest query or a Web App query. */
export interface InputWidgetMessageContent {
    /** HTML code of the widget, 1-32768 bytes. The code must not exceed 4096 bytes when compressed by zlib with the maximum compression level. */
    html: string;
    /** Width of the widget in logical pixels; omit if the widget must occupy the whole width of the message bubble. The width is clamped by the app to the range from 200 to the maximum width of the message bubble. */
    width?: number;
    /** Height of the widget in logical pixels; omit if the height of the widget isn't fixed. The height is clamped by the app to the range 50-600. */
    height?: number;
    /** Public data of the widget, 0-1024 bytes, which will be available wherever the widget is shown. If the widget is shared, then all messages with it will have the same public data. */
    public_data?: string;
    /** Data of the widget, which is specific to the message, 0-1024 bytes */
    chat_data?: string;
    /** Widget caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the widget caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Pass True if the caption must be shown above the widget */
    show_caption_above_media?: boolean;
    /** Pass True to allow the widget to send queries to the bot */
    allow_queries?: boolean;
    /** Pass True to create a shared widget. Each message sent from the result creates a separate shared widget, whose identifier is received by the bot only in the field widget_id of queries from the widget. To send an existing shared widget in response to an inline query, use InputSharedWidgetMessageContent instead. */
    is_shared?: boolean;
}

/** Represents the content of a message with an existing shared widget to be sent as the result of an inline query, a guest query or a Web App query. */
export interface InputSharedWidgetMessageContent {
    /** Unique identifier of the shared widget created by the bot */
    widget_id: string;
    /** Data of the widget, which is specific to the message, 0-1024 bytes */
    chat_data?: string;
    /** Widget caption, 0-1024 characters after entities parsing */
    caption?: string;
    /** Mode for parsing entities in the widget caption. See formatting options for more details. */
    parse_mode?: ParseMode;
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: MessageEntity[];
    /** Pass True if the caption must be shown above the widget */
    show_caption_above_media?: boolean;
}
