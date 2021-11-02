import marked from 'marked';
import DOMPurify from 'dompurify';
import styled from "styled-components";
import { emojis } from '../../utils';

marked.use({
    smartypants: true,
    smartLists: true,
    gfm: true,
});

interface RichTextRendererProps {
    content: string;
}

const BASE_TWEMOJI_URL = 'https://twemoji.maxcdn.com/v/latest/72x72/';

const StyledSpanContainer = styled.span`
  word-wrap: break-word;
  
  & p { margin: .5rem 0; }
  & h1, & h2, & h3, & h4, & h5, & h6 { margin: .8rem 0; }
  & h1, & h2, & h3 { font-size: 2em; }
  & h4 { font-size: 1.75em; }
  & h5 { font-size: 1.5em; }
  & h6 { font-size: 1.25em; }
  
  & hr { opacity: .5; }
  
  & blockquote {
    margin: .75rem 1rem;
    padding: .4rem .5rem;
    border-left: 5px solid grey;
  }
  & blockquote > *:first-child { margin-top: 0; }
  & blockquote > *:last-child { margin-bottom: 0; }
  
  & img.emoji {
    height: 1em;
    width: 1em;
    margin: 0 .05em 0 .1em;
    vertical-align: -0.1em;
  }

  &>*:first-child { margin-top: 0!important; }
  &>*:last-child { margin-bottom: 0!important; }
`

const replaceLookup: {[tag: string]: string} = {
    '<': 'lt',
    '>': 'gt',
    '&': 'amp',
    '"': 'quot',
}

/**
 * Replaces HTML <tags /> with their escaped versions
 * like &lt and &gt to prevent DOMPurify from removing them
 * (i.e. to send a message containing HTML source code etc.)
 * NOTE: This function is not intended to protect against XSS
 * attacks. It is merely to make sure text containing HTML can
 * be displayed as is at the receiving end. All text will be
 * sent thru DOMPurify regardless.
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeTags(text: string): string {
    return text.replace(/[<>&"]/gm, s => `&${replaceLookup[s]};`);
}

/**
 * Simple (more like complex) component that takes a markdown-ish
 * text and returns a rendered version of that. Also purifies HTML
 * to ensure no XSS attacks occur (security is our passion).
 * In addition to parsing GitHub-style Markdown with Marked, :emojis:
 * are also parsed into their respective twemoji images.
 * @param props
 * @constructor
 */
export default function RichTextRenderer(props: RichTextRendererProps) {
    let purifiedHTML = DOMPurify.sanitize(marked(escapeTags(props.content)), {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', // Text
            'table', 'td', 'tr', 'th', 'thead', 'hr', // Tables
            'strong', 'em', 'del', // Styles (bold, italic, strikethrough)
            'li', 'ul', 'ol', // Lists
            'pre', 'code', // Code
            'blockquote' // ||Blockquote
        ],
        ALLOW_DATA_ATTR: false,
    });

    // (safely) Modify purified HTML to parse :emojis: =D
    // Regex to the rescue!
    purifiedHTML = purifiedHTML.replace(/:[\w+-]+:/gm, matched => {
        const codePt = emojis[matched.slice(1, -1)];
        return !!codePt
            ? `<img alt="${matched.slice(1, -1)}" class="emoji" src="${BASE_TWEMOJI_URL + codePt + '.png'}" />`
            : matched;
    });

    return <StyledSpanContainer dangerouslySetInnerHTML={{__html: purifiedHTML}} />
}