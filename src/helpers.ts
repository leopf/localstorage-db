export function sanitizeKey(key: string) {
    return key.replace(/[^a-z0-9]/ig, "");
}
export function convertPathToKeyArray(path: string) {
    if (typeof path !== 'string')
        return path;
    var output: string[] = [];
    path.split('.').forEach(function (item) {
        item.split(/\[([^}]+)\]/g).forEach(function (key) {
            if (key.length > 0) {
                output.push(key);
            }
        });
    });
    return output;
}
export function getValueViaKeyArray(keyArray: string[], obj: any) {
    let tmp = obj;
    keyArray.forEach(k => tmp = tmp[k]);
    return tmp;
}