import { writable } from "svelte/store";

export const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

// 首页

const sayings = [
    "粗缯大布裹生涯，腹有诗书气自华。",
    "读书不觉已春深，一寸光阴一寸金。",
    "三更灯火五更鸡，正是男儿读书时。",
    "黑发不知勤学早，白首方悔读书迟。",
    "古人学问无遗力，少壮工夫老始成。",
    "江山代有才人出，各领风骚数百年。",
    "学而不思则罔，思而不学则殆。",
    "娶妻无媒毋须恨，书中自有颜如玉。",
    "眼前直下三千字，胸次全无一点尘。",
    "富贵必从勤苦得，男儿须读五车书。",
    "读书破万卷，下笔如有神。",
    "青春须早为，岂能长少年。",
    "半亩方塘一鉴开，天光云影共徘徊。",
    "鱼离水则身枯，心离书则神索。",
    "书卷多情似故人，晨昏忧乐每相亲。",
    "清水出芙蓉，天然去雕饰。",
    "一月不读书，耳目失精爽。",
    "读书不下苦功，妄想显荣，岂有此理？",
    "滥交朋友，不如终日读书。",
    "昨日邻家乞新火，晓窗分与读书灯。",
    "一日不读书，胸臆无佳想。",
    "文章本天成，妙手偶得之。",
    "吾生也有涯，而知也无涯。",
    "书当快意读易尽，客有可人期不来。",
    "娶妻莫恨无良媒，书中自有颜如玉。",
    "出师一表通今古，夜半挑灯更细看。",
    "人学始知道，不学非自然。",
    "此生不学一可惜，此日闲过二可惜，此身一败三可惜。",
    "少而学者如日出之阳，壮而学者如日中之光，老而学者如秉烛之明。",
    "积学以储宝，酌理以富才",
    "人不博览者，不闻古今，不见事类，不知然否，犹目盲、耳聋、鼻痈者也。",
    "安居不用架高堂，书中自有黄金屋。",
    "案上不可多书，心中不可少书。",
    "读书须用意，一字值千金。",
    "温故而知新，可以为师矣。",
    "一时劝人以口，百世劝人以书。",
    "奇文共欣赏，疑义相与析。",
    "读书好处心先觉，立雪深时道已传。",
    "酒盈杯，书满架，名利不将心挂。",
    "不学自知，不问自晓，古今行事，未之有也。",
    "读未见书，如得良友；见已读书，如逢故人。",
    "灯火纸窗修竹里，读书声。",
    "不薄今人爱古人，清词丽句必为邻。",
    "李杜诗篇万口传，至今已觉不新鲜。",
    "爱好由来下笔难，一诗千改始心安。",
    "学不精勤，不如不学 。",
    "把君诗卷灯前读，诗尽灯残天未明。",
    "读书为身上之用，而人以为纸上之用。",
    "一时劝人以言，百世劝人以书。",
    "幼而学者，如日出之光；老而学者，如秉烛夜行，犹贤乎瞑目而无见者也。",
];
export const randomSaying = () => sayings[~~(Math.random() * sayings.length)];

// 顶栏

export const route = writable<string[]>([]);
export const current = writable<string | undefined>();

export const isSidebarOpening = writable<boolean>(false);

export function getCookie(key: string): string {
    const name = `${encodeURIComponent(key)}=`;
    const cookies = decodeURIComponent(document.cookie);

    const start = cookies.indexOf(name);
    if (start === -1)
        return '';

    const startIndex = start + name.length;
    const endIndex = cookies.indexOf(';', startIndex);

    const value = endIndex === -1 ? cookies.substring(startIndex) : cookies.substring(startIndex, endIndex);

    return value;
}

type Curried<A extends any[], R> = A extends []
    ? R
    : A extends [infer F]
    ? (p: F) => R
    : A extends [infer F, ...infer L]
    ? (p: F) => Curried<L, R>
    : never;

/** 柯里化 */
export function curry<A extends any[], R>(fn: (...args: A) => R): Curried<A, R> {
    return function curried(...args: any[]): any {
        if (args.length >= fn.length) {
            return fn(...args as A);
        } else {
            return function (...next: any[]) {
                return curried(...args, ...next);
            };
        }
    } as Curried<A, R>;
}
