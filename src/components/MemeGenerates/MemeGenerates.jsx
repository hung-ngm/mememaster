import React, { useEffect, useState, useRef } from "react";
import { Button, Tabs, message } from "antd";
import ImageEditor from "@toast-ui/react-image-editor";
import logo from "./logo.png";
import bg from "./bg.png";
import "tui-image-editor/dist/tui-image-editor.css";
import { Link } from "react-router-dom";
const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");

const { TabPane } = Tabs;

const whiteTheme = {
  "menu.backgroundColor": "white",
  "common.backgroundImage": bg,
  "common.bi.image": logo,
  "downloadButton.backgroundColor": "white",
  "downloadButton.borderColor": "#ddd",
  "downloadButton.color": "black",
  "menu.normalIcon.path": icond,
  "menu.activeIcon.path": iconb,
  "menu.disabledIcon.path": icona,
  "menu.hoverIcon.path": iconc,
};

export default function MemeGenerates() {
  const [imgUrl, setimgUrl] = useState("");
  const imageEditor = React.createRef();
  // get url of image
  return (
    <div className="MemeGenerates" style={{ width: "80%", position: "sticky" }}>
      <h1 style={{ textAlign: "center" }}>Draw your memes</h1>
      <div
        style={{
          marginBottom: 20,
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          to={{
            pathname: "/MemeNFTCreate",
            search: "?img=" + imgUrl,
          }}
        >
          <Button shape="round">Create NFT</Button>
        </Link>
        <Button
          style={{marginLeft: 5}}
          shape="round"
          onClick={() => {
            const imageEditorInst = imageEditor.current.imageEditorInst;
            const data = imageEditorInst.toDataURL();
            if (data) {
              setimgUrl(data);
              message.success("Your meme has been saved!");
            }
          }}
        >
          Save Image
        </Button>
      </div>
      <ImageEditor
        includeUI={{
          loadImage: {
            path: "",
            name: "image",
          },
          theme: whiteTheme,
          initMenu: "",
          uiSize: {
            height: `calc(100vh - 160px)`,
          },
          menuBarPosition: "bottom",
        }}
        cssMaxHeight={window.innerHeight}
        cssMaxWidth={window.innerWidth}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={false}
        ref={imageEditor}
      />
    </div>
  );
}
