import * as a from 'gaclib-article';

export const acceptableAccessors = (<const>['', 'public', 'protected', 'private']);
export const acceptableCategories = (<const>['Enum', 'Class', 'Struct', 'Union', 'TypeAlias', 'Variable', 'ValueAlias', 'Namespace', 'Function']);

export interface DocSymbol {
    kind: 'Symbol';
    docId?: string;
    declFile: string;
    declId: string;
}

export interface DocParagraph {
    content: (a.Content | DocSymbol)[];
}

export interface DocText {
    name?: string;
    paragraphs: DocParagraph[];
}

export interface DocArticle {
    symbolId: string;
    accessor: typeof acceptableAccessors[number];
    category: typeof acceptableCategories[number];
    name: string;

    signature?: string;
    summary?: DocText;
    enumitem?: DocText[];
    typeparam?: DocText[];
    param?: DocText[];
    returns?: DocText;
    remarks?: DocText;
    example?: string;
    basetypes?: DocSymbol[];
    seealsos?: DocSymbol[];
}
