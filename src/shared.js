import React from "react";

const BLOCK_SIZES = ["100%", "66%", "50%", "33%"]; // block size array for documnt layout

const title = (text) => <div className="title">{text}</div>;

/** All types of block that document can have as shared resources */

// Simple text block
export function SimpleTextBlock(block, editMode, updateTitle) {
  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div
        id={block.data.id}
        key={block.data.id}
        className="block columns container margin"
      >
        <div className="block-type">{block.blockType}</div>
        {!editMode && title(block.data.title)}
        {editMode && (
          <input
            onChange={(e) => updateTitle(e, block.id)}
            defaultValue={block.data.title}
          />
        )}
        <div className="content">{block.data.content}</div>
      </div>
    </div>
  );
}

// Image block
export function ImageBlock(block) {
  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div id={block.id} key={block.id} className="block rows container margin">
        <div className="columns">
          <div className="block-type">{block.blockType}</div>
          <img srcSet={`${block.data.url} 0.5x`} alt={block.data.altText} />
          <div>{block.data.caption}</div>
        </div>
      </div>
    </div>
  );
}

// Quote block
export function QuoteBlock(block) {
  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div id={block.id} key={block.id} className="block margin columns">
        <div className="block-type">{block.blockType}</div>
        <span style={{ fontWeight: "bold" }}>{block.data}</span>
      </div>
    </div>
  );
}

// Table block
export function TableBlock(block) {
  // Table rows render
  const renderTableRows = (tableRows) => {
    let index = 1;
    if (tableRows !== undefined) {
      return tableRows.map((row) => {
        index = index + 0.1;

        return (
          <tr key={`row=${index}`}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
            <td>{row.col3}</td>
          </tr>
        );
      });
    } else {
      return null;
    }
  };

  // Table header render
  const renderTableHeader = (columns) => {
    const cols = columns.map((col) => <th key={`col-${col}`}>{col}</th>);
    return <tr>{cols}</tr>;
  };

  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div className="block margin" id={block.id} key={block.id}>
        <span className="block-type">{block.blockType}</span>
        <table className="table">
          <thead>{renderTableHeader(block.data.columns)}</thead>
          <tbody>{renderTableRows(block.data.rows)}</tbody>
        </table>
      </div>
    </div>
  );
}

// Html block
export function HTMLBlock(block) {
  // console.log("HTMLBlock");
  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div id={block.id} key={block.id} className="block columns margin ">
        <div className="block-type">{block.blockType}</div>
        <div dangerouslySetInnerHTML={{ __html: block.data }} />
      </div>
    </div>
  );
}

// Collapsabale text block
export function CollapsabaleBlock(block, editMode, toggleAction, updateTitle) {
  return (
    <div
      className="block-wrapper"
      style={{ width: BLOCK_SIZES[block.size - 1] }}
    >
      <div
        key={`${block.id}`}
        id={block.id}
        className="block columns container margin"
      >
        <div className="block-type">{block.blockType}</div>
        <button id={block.id} className="add-btn" onClick={toggleAction}>
          {block.isOpen ? "- hide" : "+ show"}
        </button>
        <div className={`collapse-content ${block.isOpen ? "show" : "hide"}`}>
          {!editMode && title(block.data.title)}
          {editMode && (
            <input onChange={updateTitle} defaultValue={block.data.title} />
          )}
          <div className="content">{block.data.content}</div>
        </div>
      </div>
    </div>
  );
}
