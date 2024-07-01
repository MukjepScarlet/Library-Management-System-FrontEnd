interface String {
    truncate(maxLength: number, sign: string): string;
}

/**
 * 若超过最大长度, 截断并加上标记
 */
String.prototype.truncate = function (maxLength: number, sign = ''): string {
    return this.length > maxLength ? this.slice(0, maxLength - sign.length) + sign : this.toString();
}
