// tslint:disable:no-submodule-imports
import { Article } from 'gaclib-article/lib/src/interfaces';
import { renderArticle } from 'gaclib-article/lib/src/rendering';
import { html, render, TemplateResult } from 'lit-html';

const buttons: [string, string, string][] = [
    ['Hello', 'index', 'Hello'],
    ['GacUI', '/home/gacui', 'GacUI!'],
    ['Data', '/home/data-processing', 'Data'],
    ['String', '/home/string-processing', 'Text'],
    ['Scripting', '/home/reflection-scripting', 'Reflection and Scripting']
];

export const viewExport = {
    renderView(model: {}, target: Element): void {
        const homeArticle = <Article>window['MVC-Resources.homeArticle'];
        const htmlTemplate = html`
${renderArticle(homeArticle)}
<h2 class="HomeCategoryHeaders">
${
            ((): TemplateResult[] => {
                const buttonHtmls = buttons.map((button: [string, string, string]) => {
                    const [htmlClass, htmlLink, htmlText] = button;
                    return html`
                        <a id="cat${htmlClass}" class="CategoryButton ${htmlClass}Button Unselected" href="/${htmlLink}.html">&nbsp;&nbsp;${htmlText}&nbsp;&nbsp;</a>
                    `;
                });
                const buttonDelimiter = html`;`;
                return buttonHtmls
                    .map((h: TemplateResult) => [h, buttonDelimiter])
                    .reduce((a: [TemplateResult], b: [TemplateResult]) => a.concat(b))
                    ;
            })()}
</h2>
<div id="homeViewContainer"/>
<script lang="javascript">
document.getElementById("cat" + activeCategory).classList.remove("Unselected");
document.getElementById("cat" + activeCategory).classList.add("Selected");
</script>
`;
        render(htmlTemplate, target);
    }
};