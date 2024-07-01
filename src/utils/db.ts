import './extensions/string.extensions';

/**
 * 用到的合法SQL数据类型
 */
type SQLType =
    'BIGINT' | 'INT' | 'DECIMAL' | `DECIMAL(${number},${number})` |
    'CHAR' | `CHAR(${number})` | 'VARCHAR' | `VARCHAR(${number})` | 'TEXT' |
    'DATE' | 'DATETIME';

/**
 * SQL Types to TS Types
 */
type SQL2TSType<T extends SQLType> =
    T extends 'BIGINT' ? number :
    T extends 'INT' ? number :
    T extends `DECIMAL(${number},${number})` ? number :
    // T extends 'CHAR' ? string :
    T extends `CHAR(${number})` ? string :
    // T extends 'VARCHAR' ? string :
    T extends `VARCHAR(${number})` ? string :
    T extends `TEXT` ? string :
    T extends 'DATE' ? Date :
    T extends 'DATETIME' ? Date :
    string;

/**
 * 修改规则
 */
type EditRule<T extends SQLType> =
    T extends 'BIGINT' ? 'number' :
    T extends 'INT' ? 'number' :
    T extends `DECIMAL(${number},${number})` ? 'number' :
    T extends 'DATE' ? 'date' :
    T extends 'DATETIME' ? 'datetime' :
    // T extends 'CHAR' ? 'text' :
    T extends `CHAR(${number})` ? 'text' :
    // T extends 'VARCHAR' ? 'text' :
    T extends `VARCHAR(${number})` ? 'text' :
    T extends `TEXT` ? 'textarea' :
    'text';

interface ColumnOptions<T extends SQLType> {
    render?: (value: SQL2TSType<T>) => string;
    step?: number;
    isPrimary?: boolean;
    isImmutable?: boolean;
    isNullable?: boolean;
    foreignKey?: { tableName: string, key: string };
}

/**
 * 表格的表头(列)信息
 */
export class Column<T extends SQLType> {
    /** 自定义渲染规则 */
    public render: (value: SQL2TSType<T>) => string;
    /** 步长 for input[type=number] */
    public step: number;
    /** 主键? */
    public isPrimary: boolean;
    /** 不可变? */
    public isImmutable: boolean;
    /** 可空? */
    public isNullable: boolean;
    /** 外键? */
    public foreignKey?: { tableName: string, key: string };

    constructor(
        /** 用来显示的字符串 */
        public renderName: string,
        /** SQL数据类型 可以自动推导泛型 */
        public type: T,
        /** 修改规则 */
        public editRule: EditRule<T>,
        /** 其他参数 */
        options: ColumnOptions<T> = {}
    ) {
        this.render = options.render ?? getDefaultRenderRule(type);
        this.step = options.step ?? 1;
        this.isPrimary = options.isPrimary ?? false;
        this.isImmutable = options.isImmutable ?? false;
        this.isNullable = options.isNullable ?? false;
        this.foreignKey = options.foreignKey;
    }
}

/**
 * SQL键 -> 列信息
 */
export interface Columns {
    [key: string]: Column<SQLType>;
}

function getDefaultRenderRule<T extends SQLType>(type: T): (value: SQL2TSType<T>) => string {
    if (type === 'TEXT')
        return (value) => (value as string).trim().truncate(50, '……');

    if (type === 'DATE')
        return (value) => (value as Date).toLocaleDateString();

    if (type === 'DATETIME')
        return (value) => (value as Date).toLocaleString();

    const match = type.match(/^DECIMAL\(\d+,(\d+)\)$/);

    if (match)
        return (value) => (value as number).toFixed(~~match[1]);

    return (value) => (value).toString();
}

// 生成行类型，键是ColumnKey，值是对应的SQL数据类型映射的TypeScript数据类型
export type Row<T extends Columns> = {
    [K in keyof Columns]: SQL2TSType<T[K]['type']>;
};

/**
 * 根据表头创建一个空的行(用于新建)
 */
export const emptyRow = (columns: Columns) => Object.entries(columns).reduce((result, [key, column]) => {
    if (column.type === 'DATE' || column.type === 'DATETIME')
        result[key] = new Date();
    else if (column.type === 'BIGINT' || column.type === 'INT' || column.type.match(/^DECIMAL\(\d+,(\d+)\)$/))
        result[key] = 0;
    else
        result[key] = "";

    return result;
}, {} as Row<typeof columns>);

/**
 * 根据表头把行中的DATE和DATETIME从接口提供的String转换成Date
 */
export const preprocess = (columns: Columns, rows: Row<typeof columns>[]) => {
    return rows.map(row => {
        Object.keys(row).filter(k => columns[k].type.includes('DATE')).forEach(k => row[k] = new Date(row[k]));
        return row;
    });
};
