'use client'
import Link from 'next/link'
import SyntaxHighlighter from 'react-syntax-highlighter'; // Ensure you have the correct import
import { dracula, docco, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Ensure you have the correct import
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { useSelector } from "react-redux";

const MarkdownContent = ({ texts }) => {
    const page = useSelector(state => state.page.page)

    const applyMarkdown = (text) => {
        if (typeof text !== 'string') {
            console.warn('applyMarkdown was called with a non-string argument');
            return null;
        }

        // Updated regex to include underline syntax (__text__)
        //const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|#{1,6} .*?\n|- .*?\n|\[.*?\]\(http[s]?:\/\/.*?\)|https?:\/\/[^\s]+)/);  Original
        //const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|#{1,6} .*?\n|- .*?\n|\[.*?\]\(http[s]?:\/\/.*?\)|https?:\/\/[^\s]+|```[\s\S]+?```)/); // Added code block syntax

        // Updated regex to include complex LaTeX math
        const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|#{1,6} .*?\n|- .*?\n|\[.*?\]\(http[s]?:\/\/.*?\)|https?:\/\/[^\s]+|```[\s\S]+?```|\\\[.*?\\\]|\\\(.+?\\\))/);
        // Function to parse inner markdown (bold/italic/underline) inside headings
        const parseInnerMarkdown = (text) => {
            return text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|\n)/).map(innerSegment => {
                if (/^\*\*(.*?)\*\*$/.test(innerSegment)) {
                    return <strong>{innerSegment.slice(2, -2)}</strong>;
                } else if (/^\*(.*?)\*$/.test(innerSegment)) {
                    return <em>{innerSegment.slice(1, -1)}</em>;
                } else if (/^__(.*?)__$/.test(innerSegment)) {
                    return <u>{innerSegment.slice(2, -2)}</u>;
                } else {
                    return innerSegment;
                }
            });
        };

        const parseListItem = (itemText) => {
            return itemText.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|\n)/).map(innerSegment => {
                if (/^\*\*(.*?)\*\*$/.test(innerSegment)) {
                    return <strong>{innerSegment.slice(2, -2)}</strong>;
                } else if (/^\*(.*?)\*$/.test(innerSegment)) {
                    return <em>{innerSegment.slice(1, -1)}</em>;
                } else if (/^__(.*?)__$/.test(innerSegment)) {
                    return <u>{innerSegment.slice(2, -2)}</u>;
                } else {
                    return innerSegment;
                }
            });
        };

        // Map over the segments and return the appropriate JSX elements
        const jsx = segments.map(segment => {
            // Latex
            if (/^\\\((.+?)\\\)$/.test(segment)) {
                const mathContent = segment.match(/^\\\((.+?)\\\)$/)[1].trim();
                return <InlineMath math={mathContent} />;
            } else if (/^\\\[.*?\\\]$/.test(segment)) {
                const mathContent = segment.slice(2, -2).trim(); // Remove the enclosing \[ and \]
                return <BlockMath math={mathContent} />;
            }

            // Other Markdown
            if (/^\*\*(.*?)\*\*$/.test(segment)) {
                return <strong>{segment.slice(2, -2)}</strong>;
            } else if (/^\*(.*?)\*$/.test(segment)) {
                return <em>{segment.slice(1, -1)}</em>;
            } else if (/^__(.*?)__$/.test(segment)) {
                return <u>{segment.slice(2, -2)}</u>;
            } else if (/^(#{1,6}) (.*?)(\n|$)/.test(segment)) {
                const match = segment.match(/^(#{1,6}) (.*?)(\n|$)/);
                const level = match[1].length;
                const text = match[2];
                const Heading = `h${level}`;
                return <Heading className={`heading${level}`}>{parseInnerMarkdown(text)}</Heading>;
            } else if (/\[(.*?)\]\((http[s]?:\/\/.*?)\)/.test(segment)) {
                const match = segment.match(/\[(.*?)\]\((http[s]?:\/\/.*?)\)/);
                const text = match[1];
                const url = match[2];
                return <Link href={url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{text}</Link>;
            } else if (/^- (.*?)\n$/.test(segment)) {
                const listItemContent = segment.slice(2, -1);
                return <li>{parseListItem(listItemContent)}</li>;
            } else if (/^https?:\/\/[^\s]+$/.test(segment)) {
                return <Link href={segment} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{segment}</Link>;
            } else if (/^```(\w+)?\n([\s\S]+?)```$/.test(segment)) {
                // Code block syntax
                const match = segment.match(/^```(\w+)?\n([\s\S]+?)```$/);
                const language = match[1] || 'plaintext'; // Default to 'plaintext' if no language is specified
                const code = match[2];

                return (
                    <div className={`${page === 'notes/[noteid]' ? 'w-[91vw] sm:w-[63.6vw]' : 'w-[82vw] sm:w-[53vw]'} rounded-2xl`}>
                        <SyntaxHighlighter language={language} style={atomOneDark} customStyle={{
                            overflowX: 'scroll',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            borderRadius: '10px',
                        }}>
                            {code}
                        </SyntaxHighlighter>
                    </div>
                );
            } else {
                return segment;
            }
        });

        return jsx;
    };

    return (
        <>
            {applyMarkdown(texts)}
        </>
    );
};

export default MarkdownContent;








// BACKUP!!! ✅

// import Link from 'next/link'

// const MarkdownContent = ({ texts }) => {
//     const applyMarkdown = (text) => {
//         if (typeof text !== 'string') {
//             console.warn('applyMarkdown was called with a non-string argument');
//             return null;
//         }

//         // Updated regex to include underline syntax (__text__)
//         const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|#{1,6} .*?\n|- .*?\n|https?:\/\/[^\s]+)/);

//         // Function to parse inner markdown (bold/italic/underline) inside headings
//         const parseInnerMarkdown = (text) => {
//             return text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|\n)/).map(innerSegment => {
//                 if (/^\*\*(.*?)\*\*$/.test(innerSegment)) {
//                     return <strong>{innerSegment.slice(2, -2)}</strong>;
//                 } else if (/^\*(.*?)\*$/.test(innerSegment)) {
//                     return <em>{innerSegment.slice(1, -1)}</em>;
//                 } else if (/^__(.*?)__$/.test(innerSegment)) {
//                     return <u>{innerSegment.slice(2, -2)}</u>;
//                 } else {
//                     return innerSegment;
//                 }
//             });
//         };

//         const parseListItem = (itemText) => {
//             return itemText.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|\n)/).map(innerSegment => {
//                 if (/^\*\*(.*?)\*\*$/.test(innerSegment)) {
//                     return <strong>{innerSegment.slice(2, -2)}</strong>;
//                 } else if (/^\*(.*?)\*$/.test(innerSegment)) {
//                     return <em>{innerSegment.slice(1, -1)}</em>;
//                 } else if (/^__(.*?)__$/.test(innerSegment)) {
//                     return <u>{innerSegment.slice(2, -2)}</u>;
//                 } else {
//                     return innerSegment;
//                 }
//             });
//         };

//         // Map over the segments and return the appropriate JSX elements
//         const jsx = segments.map(segment => {
//             if (/^\*\*(.*?)\*\*$/.test(segment)) {
//                 return <strong>{segment.slice(2, -2)}</strong>;
//             } else if (/^\*(.*?)\*$/.test(segment)) {
//                 return <em>{segment.slice(1, -1)}</em>;
//             } else if (/^__(.*?)__$/.test(segment)) {
//                 return <u>{segment.slice(2, -2)}</u>;
//             } else if (/^(#{1,6}) (.*?)(\n|$)/.test(segment)) {
//                 const match = segment.match(/^(#{1,6}) (.*?)(\n|$)/);
//                 const level = match[1].length;
//                 const text = match[2];
//                 const Heading = `h${level}`;
//                 return <Heading className={`heading${level}`}>{parseInnerMarkdown(text)}</Heading>;
//             } else if (/^- (.*?)\n$/.test(segment)) {
//                 const listItemContent = segment.slice(2, -1);
//                 return <li>{parseListItem(listItemContent)}</li>;
//             } else if (/^https?:\/\/[^\s]+$/.test(segment)) {
//                 return <Link href={segment} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{segment}</Link>;
//             } else {
//                 return segment;
//             }
//         });

//         return jsx;
//     };

//     return (
//         <>
//             {applyMarkdown(texts)}
//         </>
//     );
// };

// export default MarkdownContent;

