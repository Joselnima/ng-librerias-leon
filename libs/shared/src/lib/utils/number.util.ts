export class NumberUtil {

    static isNumber(value: unknown): boolean {
        const number = Number(value);
        return !isNaN(number) && typeof number === 'number';
    }

}