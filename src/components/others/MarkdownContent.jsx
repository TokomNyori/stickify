import Link from 'next/link'

const MarkdownContent = ({ texts }) => {
    const applyMarkdown = (text) => {
        if (typeof text !== 'string') {
            console.warn('applyMarkdown was called with a non-string argument');
            return null;
        }

        // Updated regex to include underline syntax (__text__)
        const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|#{1,6} .*?\n|- .*?\n|https?:\/\/[^\s]+)/);

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
            } else if (/^- (.*?)\n$/.test(segment)) {
                const listItemContent = segment.slice(2, -1);
                return <li>{parseListItem(listItemContent)}</li>;
            } else if (/^https?:\/\/[^\s]+$/.test(segment)) {
                return <Link href={segment} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{segment}</Link>;
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
