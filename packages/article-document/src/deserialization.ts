import { Element, xml2js } from 'xml-js';
import * as d from './interfaces';

export function parseDocument(xml: string): d.DocArticle {
    const element = <Element>xml2js(
        xml,
        {
            compact: false,
            ignoreDeclaration: true,
            ignoreInstruction: true,
            ignoreComment: true,
            ignoreDoctype: true
        }
    );

    if (element.elements === undefined) {
        throw new Error(`Root element of an article should be <document> instead of <${element.name}>.`);
    }

    const xmlArticle = element.elements[0];
    if (xmlArticle.name !== 'document') {
        throw new Error(`Root element of an article should be <document> instead of <${element.name}>.`);
    }
    if (xmlArticle.attributes === undefined) {
        throw new Error(`Missing attribute "symbolId", "accessor", "category" and "name" in <document>.`);
    }
    if (xmlArticle.attributes.symbolId === undefined) {
        throw new Error(`Missing attribute "symbolId" in <document>.`);
    }
    if (xmlArticle.attributes.accessor === undefined) {
        throw new Error(`Missing attribute "accessor" in <document>.`);
    }
    if (xmlArticle.attributes.category === undefined) {
        throw new Error(`Missing attribute "category" in <document>.`);
    }
    if (xmlArticle.attributes.name === undefined) {
        throw new Error(`Missing attribute "name" in <document>.`);
    }

    if (!(<readonly string[]>d.acceptableAccessors).includes(`${xmlArticle.attributes.accessor}`)) {
        throw new Error(`Attribute "accessor" in <document> can only be one of ${JSON.stringify(d.acceptableAccessors)}.`);
    }
    if (!(<readonly string[]>d.acceptableCategories).includes(`${xmlArticle.attributes.category}`)) {
        throw new Error(`Attribute "category" in <document> can only be one of ${JSON.stringify(d.acceptableCategories)}.`);
    }

    const darticle: d.DocArticle = {
        symbolId: `${xmlArticle.attributes.symbolId}`,
        accessor: <typeof d.acceptableAccessors[number]>`${xmlArticle.attributes.accessor}`,
        category: <typeof d.acceptableCategories[number]>`${xmlArticle.attributes.category}`,
        name: `${xmlArticle.attributes.name}`
    };

    if (xmlArticle.elements !== undefined) {
        for (const subElement of xmlArticle.elements) {
            if (subElement.type === 'element') {
                switch (subElement.name) {
                    case 'summary':
                    case 'remarks':
                    case 'returns':
                        throw new Error('Not implemented!');
                    case 'typeparam':
                    case 'param':
                    case 'enumitem':
                        throw new Error('Not implemented!');
                    case 'signature': {
                        if (subElement.elements === undefined || subElement.elements.length !== 1 || subElement.elements[0].type !== 'cdata') {
                            throw new Error(`Only CData is allowed in <signature>.`);
                        }
                        darticle.signature = `${subElement.elements[0].cdata}`;
                        break;
                    }
                    case 'example': {
                        if (subElement.elements === undefined || subElement.elements.length !== 1 || subElement.elements[0].type !== 'cdata') {
                            throw new Error(`Only CData is allowed in <example>.`);
                        }
                        darticle.example = `${subElement.elements[0].cdata}`;
                        break;
                    }
                    case 'basetypes':
                    case 'seealsos': {
                        if (subElement.elements !== undefined) {
                            for (const xmlSymbol of subElement.elements) {
                                if (xmlSymbol.type === 'element') {
                                    if (xmlSymbol.name !== 'symbol') {
                                        throw new Error(`Only <symbol> is allowed in <${subElement.name}>`);
                                    }
                                    if (xmlSymbol.attributes === undefined) {
                                        throw new Error(`Missing attribute "docId" (optional), "declFile", "declId" in <document>.`);
                                    }
                                    if (xmlSymbol.attributes.declFile === undefined) {
                                        throw new Error(`Missing attribute "declFile" in <symbol>.`);
                                    }
                                    if (xmlSymbol.attributes.declId === undefined) {
                                        throw new Error(`Missing attribute "declId" in <symbol>.`);
                                    }

                                    const dsymbol: d.DocSymbol = {
                                        declFile: `${xmlSymbol.attributes.declFile}`,
                                        declId: `${xmlSymbol.attributes.declId}`
                                    };
                                    if (xmlSymbol.attributes.docId !== undefined) {
                                        dsymbol.docId = `${xmlSymbol.attributes.docId}`;
                                    }

                                    if (darticle[subElement.name] === undefined) {
                                        darticle[subElement.name] = [];
                                    }
                                    darticle[subElement.name]?.push(dsymbol);
                                }
                            }
                        }
                        break;
                    }
                    default:
                        throw new Error(`Unrecognizable top level element: <${subElement.name}>.`);
                }
            }
        }
    }

    return darticle;
}
