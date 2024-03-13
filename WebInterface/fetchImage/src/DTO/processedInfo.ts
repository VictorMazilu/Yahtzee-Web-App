export interface ProcessedInfo{
    message: string;
    base64Image: string;
}

function dictSize(obj: { [key: string]: any }) : boolean{
    return Object.keys(obj).length === 0;
}