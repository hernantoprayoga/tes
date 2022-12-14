import type { PointerInput } from '../pointer';
import type { UserEventApi } from '.';
import { Config } from './config';
export declare function clear(element: Element): Promise<void>;
export declare function click(element: Element, options?: Partial<Config>): Promise<void>;
export declare function copy(options?: Partial<Config>): Promise<DataTransfer | undefined>;
export declare function cut(options?: Partial<Config>): Promise<DataTransfer | undefined>;
export declare function dblClick(element: Element, options?: Partial<Config>): Promise<void>;
export declare function deselectOptions(select: Element, values: HTMLElement | HTMLElement[] | string[] | string, options?: Partial<Config>): Promise<void>;
export declare function hover(element: Element, options?: Partial<Config>): Promise<void>;
export declare function keyboard(text: string, options?: Partial<Config>): Promise<import("../keyboard").keyboardState>;
export declare function pointer(input: PointerInput, options?: Partial<Config>): Promise<import("../pointer").pointerState>;
export declare function paste(clipboardData?: DataTransfer | string, options?: Partial<Config>): Promise<void>;
export declare function selectOptions(select: Element, values: HTMLElement | HTMLElement[] | string[] | string, options?: Partial<Config>): Promise<void>;
export declare function tripleClick(element: Element, options?: Partial<Config>): Promise<void>;
export declare function type(element: Element, text: string, options?: Partial<Config> & Parameters<UserEventApi['type']>[2]): Promise<void>;
export declare function unhover(element: Element, options?: Partial<Config>): Promise<void>;
export declare function upload(element: HTMLElement, fileOrFiles: File | File[], options?: Partial<Config>): Promise<void>;
export declare function tab(options?: Partial<Config> & Parameters<UserEventApi['tab']>[0]): Promise<void>;
