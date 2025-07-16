import { StringLiteral } from "typescript";
import { Parameter, Device, QueueItem } from "./apiTypes";

/* export interface PopupItem extends QueueItem {
    name: string;
    kwargs?: { [key: string]: any };
    item_uid: string;
    user: string;
    user_group: string;
    result?: {
        exit_status: string;
        time_start: number;
        time_stop: number;
        run_uids: string[];
        scan_ids: string[];
        traceback: string;
        msg: string;
    };
}; */

export interface PopupItem extends QueueItem {
    //popup may be a current item or a history item
    result?: {
        exit_status: string;
        time_start: number;
        time_stop: number;
        run_uids: string[];
        scan_ids: string[];
        traceback: string;
        msg: string;
    };
};

export interface HistoryResultRow {
    name: string;
    icon: JSX.Element;
    content: JSX.Element | null;
};

/* export type Parameter = {
    name: string;
    description?: string;
    value: string | string[] | object;
    required: boolean;
    [key: string]: any;
    annotation?: {type: string};
    enums?: string[];
};

export type Parameters = {
    [key: string]: Parameter;
}; */

export type Plan = {
    name: string;
    kwargs: Record<string, any>; 
    item_type: string; 
};

export interface PlanInput {
    name: string;
    parameters: ParameterInputDict;
}

export interface ParameterInput extends Parameter {
    value: string | string[];
    required: boolean;
    [key:string]: any; //required for metadata field which allows writing of any key/value pair. should be refactored so that md lives inside 'value' as dict
}

export interface ParameterInputDict {
    [key: string]: ParameterInput;
}

export interface CopiedPlan {
    name: string;
    parameters: ParameterInputDict;
}

export interface AllowedDevices {
    [key: string]: Device;
}

export interface GlobalMetadata {
    [key: string]: any;
}