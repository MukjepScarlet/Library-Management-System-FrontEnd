import "./extensions/string.extensions";
import DateInput from "$/components/editor/inputs/DateInput.svelte";
import DateTimeInput from "$/components/editor/inputs/DateTimeInput.svelte";
import StringInput from "$/components/editor/inputs/StringInput.svelte";
import TextInput from "$/components/editor/inputs/TextInput.svelte";
import NumberInput from "$/components/editor/inputs/NumberInput.svelte";

/**
 * 用到的合法SQL数据类型
 */
type NumberType = "BIGINT" | "INT" | "DECIMAL";

type TextType = "CHAR" | "VARCHAR" | "TEXT";

type SQLType = NumberType | TextType | "DATE" | "DATETIME";

/**
 * SQL Types to TS Types
 */
type SQL2TSType<T extends SQLType> = T extends NumberType
    ? number
    : T extends TextType
    ? string
    : T extends "DATE"
    ? Date
    : T extends "DATETIME"
    ? Date
    : never;

/**
 * 修改规则
 */
type Input<T extends SQLType> = T extends NumberType
    ? typeof NumberInput
    : T extends "CHAR"
    ? typeof StringInput
    : T extends "VARCHAR"
    ? typeof StringInput
    : T extends "TEXT"
    ? typeof TextInput
    : T extends "DATE"
    ? typeof DateInput
    : T extends "DATETIME"
    ? typeof DateTimeInput
    : never;

interface ForeignKeyInfo {
    tableName: string;
    key: string;
}

interface ColumnOptions {
    isPrimary?: boolean;
    isImmutable?: boolean;
    isNullable?: boolean;
    foreignKey?: ForeignKeyInfo;
}

export abstract class Column<T extends SQLType> {
    /** 主键? */
    public isPrimary: boolean;
    /** 不可变? */
    public isImmutable: boolean;
    /** 可空? */
    public isNullable: boolean;
    /** 外键? */
    public foreignKey?: ForeignKeyInfo;

    constructor(
        /** 用来显示的字符串 */
        public name: string,
        /** SQL数据类型 可以自动推导泛型 */
        public type: T,
        /** 默认值 */
        public defaultValue: SQL2TSType<T>,
        /** 修改规则 */
        public editor: Input<T>,
        /** 自定义渲染规则 */
        public render: (value: SQL2TSType<T>) => string = (a: SQL2TSType<T>) => new String(a).toString(),
        /** 其他参数 */
        options: ColumnOptions = {}
    ) {
        this.isPrimary = options.isPrimary ?? false;
        this.isImmutable = options.isImmutable ?? false;
        this.isNullable = options.isNullable ?? false;
        this.foreignKey = options.foreignKey;
    }
}

export class NumberColumn<T extends NumberType> extends Column<T> {
    public precision: number;
    public scale: number;

    constructor(
        name: string,
        type: T,
        options: ColumnOptions & {
            editor?: Input<T>;
            precision?: number;
            scale?: number;
        } = {}
    ) {
        super(name, type, 0 as SQL2TSType<T>, options.editor ?? (NumberInput as Input<T>), (a: number) => a.toFixed(options.scale ?? 0), options);
        if (type === "BIGINT") {
            this.precision = 19;
            this.scale = 0;
        } else if (type === "INT") {
            this.precision = 10;
            this.scale = 0;
        } else {
            this.precision = options.precision ?? 38;
            this.scale = options.scale ?? 0;
        }
    }
}

export class TextColumn<T extends TextType> extends Column<T> {
    public maxLength: number;
    constructor(name: string, type: T, options: ColumnOptions & { editor?: Input<T>; maxLength?: number } = {}) {
        super(name, type, "" as SQL2TSType<T>, options.editor ?? ((type === "TEXT" ? TextInput : StringInput) as Input<T>), (a: string) => a, options);
        this.maxLength = options.maxLength ?? 65535;
    }
}

export class DateColumn<T extends "DATE" | "DATETIME"> extends Column<T> {
    constructor(name: string, type: T, options: ColumnOptions & { editor?: Input<T> } = {}) {
        super(
            name,
            type,
            new Date() as SQL2TSType<T>,
            options.editor ?? ((type === "DATE" ? DateInput : DateTimeInput) as Input<T>),
            type === "DATE" ? (a: Date) => a.toLocaleDateString() : (a: Date) => a.toLocaleString(),
            options
        );
    }
}

export const TABLES = {
    users: {
        name: "用户",
        searchable: false,
        managePermission: 2,
        columns: {
            userId: new NumberColumn("ID", "BIGINT", { isPrimary: true, isImmutable: true }),
            idNumber: new TextColumn("借书证号", "VARCHAR", { maxLength: 10, isImmutable: true }),
            studentIdNumber: new TextColumn("学工号", "VARCHAR", { maxLength: 20 }),
            userName: new TextColumn("用户名", "VARCHAR", { maxLength: 40 }),
            password: new TextColumn("密码", "VARCHAR", { maxLength: 40 }),
            email: new TextColumn("联系方式", "VARCHAR", { maxLength: 40 }),
            roleId: new NumberColumn("角色ID", "BIGINT", { isImmutable: true, foreignKey: { tableName: "roles", key: "id" } }),
            createDate: new DateColumn("注册日期", "DATE", { isImmutable: true }),
            bookNum: new NumberColumn("借阅数", "INT", { isImmutable: true }),
            fine: new NumberColumn("罚款金额", "DECIMAL", { precision: 10, scale: 2, isImmutable: true }),
        },
    },
    roles: {
        name: "角色",
        searchable: false,
        managePermission: 3,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true, isImmutable: true }),
            roleName: new TextColumn("角色名称", "VARCHAR", { maxLength: 20 }),
            permissionId: new TextColumn("权限ID", "VARCHAR", { maxLength: 40 }), // 设计有问题
        },
    },
    permissions: {
        name: "权限",
        searchable: false,
        managePermission: 3,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true, isImmutable: true }),
            permissionName: new TextColumn("权限名称", "VARCHAR", { maxLength: 40 }),
            aclValue: new TextColumn("权限码", "VARCHAR", { maxLength: 60 }),
        },
    },
    books: {
        name: "书籍",
        searchable: false,
        managePermission: 2,
        columns: {
            isbn: new TextColumn("ISBN", "CHAR", { maxLength: 13, isPrimary: true }),
            name: new TextColumn("名称", "VARCHAR", { maxLength: 40 }),
            author: new TextColumn("作者", "VARCHAR", { maxLength: 40 }),
            press: new TextColumn("出版社", "VARCHAR", { maxLength: 40 }),
            price: new NumberColumn("价格", "DECIMAL", { precision: 10, scale: 2, isNullable: true }),
            num: new NumberColumn("数目", "INT", { isNullable: true }),
            position: new TextColumn("所在书架", "VARCHAR", { maxLength: 40 }),
            date: new DateColumn("更新日期", "DATE", { isImmutable: true }),
        },
    },
    labels: {
        name: "标签",
        searchable: true,
        managePermission: 2,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true, isImmutable: true }),
            name: new TextColumn("标签名称", "VARCHAR", { maxLength: 40 }),
            num: new NumberColumn("数量", "INT"),
        },
    },
    book_label: {
        name: "书籍-标签",
        searchable: true,
        managePermission: 2,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true, isImmutable: true }),
            isbn: new TextColumn("ISBN", "CHAR", { maxLength: 13, foreignKey: { tableName: "books", key: "isbn" } }),
            labelId: new NumberColumn("标签ID", "BIGINT", { foreignKey: { tableName: "labels", key: "id" } }),
        },
    },
    notice: {
        name: "公告",
        searchable: true,
        managePermission: 2,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true }),
            title: new TextColumn("标题", "VARCHAR", { maxLength: 40 }),
            content: new TextColumn("内容", "TEXT"),
            createTime: new DateColumn("创建时间", "DATETIME", { editor: DateTimeInput, isImmutable: true }),
            updateTime: new DateColumn("修改时间", "DATETIME", { editor: DateTimeInput }),
            viewNum: new NumberColumn("查看人次", "INT", { isImmutable: true, isNullable: true }),
        },
    },
    borrowinfo: {
        name: "借阅信息",
        searchable: false,
        managePermission: 2,
        columns: {
            id: new NumberColumn("ID", "BIGINT", { isPrimary: true }),
            isbn: new TextColumn("ISBN", "CHAR", { maxLength: 13, foreignKey: { tableName: "books", key: "isbn" } }),
            userId: new NumberColumn("用户ID", "BIGINT", { foreignKey: { tableName: "users", key: "userId" } }),
            beginTime: new DateColumn("借书时间", "DATETIME", { editor: DateTimeInput, isImmutable: true }),
            returnTime: new DateColumn("预期归还时间", "DATETIME", { editor: DateTimeInput }),
            fine: new NumberColumn("罚款金额", "DECIMAL", { precision: 10, scale: 2 }),
        },
    },
};

export type TablesType = typeof TABLES;

export type TableName = keyof TablesType;

export type Columns<T extends TableName> = TablesType[T]["columns"];

export type Row<C extends Columns<any>> = {
    [K in keyof C]: C[K] extends Column<infer U> ? SQL2TSType<U> : never;
};

export default {
    /**
     * 根据表头创建一个空的行(用于新建)
     */
    emptyRow: <T extends TableName>(columns: Columns<T>) =>
        Object.entries(columns).reduce((result, [key, column]) => {
            result[key as keyof typeof columns] = column.defaultValue;
            return result;
        }, {} as Row<typeof columns>),

    /** userId -> user_id */
    parseColumnName: (str: string) => str.replace(/([A-Z])/g, "_$1").toLowerCase(),

    /**
     * 根据表头把行中的DATE和DATETIME从接口提供的String转换成Date
     */
    preprocess: <T extends TableName>(columns: Columns<T>, rows: Row<typeof columns>[]): Row<typeof columns>[] =>
        rows.map((row) => {
            for (const key of Object.keys(columns) as (keyof typeof columns)[]) if (columns[key] instanceof DateColumn) (row[key] as Date) = new Date(row[key]);

            return row;
        }),
};
