import "./styles.css";

import { useEffect, useState } from "react";
import {
  SimpleTextBlock,
  ImageBlock,
  CollapsabaleBlock,
  HTMLBlock,
  QuoteBlock,
  TableBlock
} from "./shared.js";

export default function App() {
  const [documentLayout, setDocumentLayout] = useState(null);
  const [rollbackData, setRollbackData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchDocument(); // loading document's data on component first mount
  }, []);

  // function for handle collapsable blocks change of collapse state
  const toggleColapseble = (e) => {
    const updated = Object.assign({}, documentLayout);
    updated[e.target.id].isOpen = !documentLayout[e.target.id].isOpen;
    setDocumentLayout(updated);
  };

  // function for handle update text/collapsable block's title
  const handleUpdateTitle = (e, key) => {
    const updated = Object.assign({}, documentLayout);
    updated[key].data.title = e.target.value;
    setDocumentLayout(updated);
  };

  // adjust json of loaded document for parsing purposes by the app
  const loadDocument = (data) => {
    const orderedBlocks = Object.keys(data.documentLayout)
      .sort((a, b) =>
        // sorting blocks key by block's sort parameters, to have block displayed by their order
        // sorting document hash map by re-ordering map keys
        data.documentLayout[a].order > data.documentLayout[b].order ? 1 : -1
      )
      .reduce((obj, key) => {
        let val = data.documentLayout[key];

        if (val.blockType === "collapsabale") {
          // adding state param for collapsable block items
          val = Object.assign({}, val, { isOpen: false });
        }

        // adding Id param for each  block item that represents thair key in document's map object
        obj[key] = Object.assign({}, val, { id: key });
        return obj;
      }, {});
    console.log(orderedBlocks);
    setDocumentLayout(orderedBlocks);
  };

  // function for handle turn on of edit mode
  const handleToggleEditMode = () => {
    // creating initial document status before
    // any change to have a rollback version in case of discard action /
    setRollbackData(Object.assign({}, documentLayout));
    setEditMode(true);
  };

  // function for handle saving the changed document
  const handleSave = () => {
    setEditMode(false);
  };

  // function for handle disacrd of changes
  const handleDisacrd = () => {
    setEditMode(false);
    // setting document to it's pre change state
    setDocumentLayout(rollbackData);
    setRollbackData(null);
  };

  // function for loading the document from public folder in projcet folder to mimic proces of
  // loading document from server
  const fetchDocument = () => {
    fetch(`document.json`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((r) => r.json())
      .then((res) => {
        loadDocument(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // parsing each block by it's type for it's proper component
  const listBlock = (data) => {
    if (data) {
      return Object.values(data).map((item) => {
        switch (item.blockType) {
          case "simpleText":
            return SimpleTextBlock(item, editMode, handleUpdateTitle);
          case "image":
            return ImageBlock(item);
          case "quote":
            return QuoteBlock(item);
          case "table":
            return TableBlock(item);
          case "html":
            return HTMLBlock(item);
          case "collapsabale":
            return CollapsabaleBlock(
              item,
              editMode,
              toggleColapseble,
              handleUpdateTitle
            );
          default:
            return null;
        }
      });
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <div id="app-header" className="page-header">
        <h1>Document Render</h1>
        {!editMode && (
          <button className="edit-btn" onClick={handleToggleEditMode}>
            edit
          </button>
        )}
        {editMode && (
          <button className="edit-btn" onClick={handleSave}>
            save
          </button>
        )}
        {editMode && (
          <button className="edit-btn" onClick={handleDisacrd}>
            discard
          </button>
        )}
      </div>
      {documentLayout && listBlock(documentLayout)}
    </div>
  );
}
