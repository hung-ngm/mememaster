import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Upload,
  Modal,
  message,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Tooltip,
} from "antd";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import tokenContractAbi from "../../contracts/abis/tokenContractAbi.js"
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Title } = Typography;
const { TextArea } = Input;

const TOKEN_CONTRACT_ADDRESS = "0xB798f7fFf20B19D7C61751907AF74aD64EeF73B8";

const formatNumber = (value) => {
  value += "";
  const list = value.split(".");
  const prefix = list[0].charAt(0) === "-" ? "-" : "";
  let num = prefix ? list[0].slice(1) : list[0];
  let result = "";
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
};

const styles = {
  fileUpload: {
    margin: "15px",
    paddingRight: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    padding: "10px",
    display: "inline-block",
    width: "100%",
  },
  priceInput: {
    width: "100%",
    minWidth: "475px",
  },
  nameInput: {
    width: "100%",
    minWidth: "475px",
  },
  descriptionTextArea: {
    height: "120px",
    minWidth: "475px",
    width: "100%",
  },
};

// transfer file to data url
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// enter price
const NumericInput = (props) => {
  const onChange = (e) => {
    console.log(e.target.value);
    const reg = /^-?\d*(\.\d*)?$/;
    if (
      (!isNaN(e.target.value) && reg.test(e.target.value)) ||
      e.target.value === "" ||
      e.target.value === "-"
    ) {
      props.onChange(e.target.value);
    }
  };

  const onBlur = () => {
    const { value, onChange } = props;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
    if (onBlur) {
      onBlur();
    }
  };

  const { value } = props;
  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(value) : "-"}
    </span>
  ) : (
    "Input a number"
  );
  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        size="large"
        value={value}
        onChange={onChange}
        placeholder="Input a number"
        maxLength={100}
        style={styles.priceInput}
      />
    </Tooltip>
  );
};

const MemeNFTCreate = () => {
  const { web3, Moralis, user } = useMoralis();
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const tokenContract = new web3.eth.Contract(tokenContractAbi, TOKEN_CONTRACT_ADDRESS);

  var imgUrl = new URLSearchParams(useLocation().search).get("img");
  const originalFileList = [];
  if (imgUrl) {
    imgUrl = imgUrl.replace(/ /g, "+");
    originalFileList.push({
      uid: "-1",
      name: "mememaster.png",
      status: "done",
      url: imgUrl,
    });
  }

  const [images, setImages] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: originalFileList,
  });

  const props = {
    name: "file",
    multiple: true,
    fileList: images.fileList,
    listType: "picture-card",
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }
      if (!(isJpgOrPng && isLt2M)) return Upload.LIST_IGNORE;
      return false;
    },
    onChange(info) {
      const fileList = info.fileList;
      setImages({
        ...images,
        fileList: fileList,
      });
      if (info.file.status === "removed")
        message.success(`${info.file.name} file removed successfully.`);
      else message.success(`${info.file.name} file uploaded successfully.`);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setImages({
        ...images,
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle:
          file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      });
    },
  };
  const onPriceChange = (e) => {
    setPrice(e);
  };
  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      images: images,
      price: price,
      name: name,
      desc: description,
    });
    await createItem();
    console.log(images.fileList[0]);
  };
  

  const createItem = async () => {
    if (images.fileList.length == 0) {
      message.error("Please select a file");
      return;
    } else if (price == 0) {
      message.error("Please enter a price");
      return;
    } else if (name === "") {
      message.error("Please enter a name");
      return;
    } 

    const fileUrl = images.fileList[0].thumbUrl;
    const nftFile = new Moralis.File("nftFile.jpg", {base64: fileUrl});
    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();
    const nftFileHash = nftFile.hash();

    const metadata = {
      name: name,
      description: description,
      image: nftFilePath
    }

    const nftFileMetadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await nftFileMetadataFile.saveIPFS();

    const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
    const nftFileMetadataFileHash = nftFileMetadataFile.hash();

    const nftId = await mintNft(nftFileMetadataFilePath);

    const Item = Moralis.Object.extend("Item");
    const item = new Item();
    item.set("name", name);
    item.set("description", description);
    item.set("nftFilePath", nftFilePath);
    item.set("metadataFilePath", nftFileMetadataFilePath);
    item.set("nftId", nftId);
    item.set("nftContractAddress", TOKEN_CONTRACT_ADDRESS);
    await item.save();
    console.log(item);
  }

  const mintNft = async (metadataUrl) => {
    const receipt = await tokenContract.methods.createItem(metadataUrl).send({ from: web3.currentProvider.selectedAddress });
    console.log(receipt);
    return receipt.events.Transfer.returnValues.tokenId;
  }

  return (
    <div>
      <Title>Create your meme as an NFT</Title>
      <Row>
        <Col span={18} id="createFile">
          <Row>
            <div id="fileUpload" style={styles.titleWrapper}>
              <Title level={4}>Upload file</Title>
              <Col span={20} offset={2} style={styles.fileUpload}>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                  </p>
                </Dragger>
                <Modal
                  visible={images.previewVisible}
                  title={images.previewTitle}
                  footer={null}
                  onCancel={() =>
                    setImages({
                      ...images,
                      previewVisible: false,
                      previewImage: "",
                      previewTitle: "",
                    })
                  }
                >
                  <img
                    alt={images.previewTitle}
                    style={{ width: "100%" }}
                    src={images.previewImage}
                  />
                </Modal>
              </Col>
            </div>
          </Row>

          <Row>
            <div id="price" style={styles.titleWrapper}>
              <Title level={4}>Price</Title>
              <Col span={24}>
                <NumericInput value={price} onChange={onPriceChange} />
              </Col>
            </div>
          </Row>

          <Row>
            <div id="name" style={styles.titleWrapper}>
              <Title level={4}>Name</Title>
              <Col span={24}>
                <Input
                  size="large"
                  placeholder="Enter your name"
                  style={styles.nameInput}
                  value={name}
                  onChange={onNameChange}
                />
              </Col>
            </div>
          </Row>

          <Row>
            <div id="description" style={styles.titleWrapper}>
              <Row id="descriptionTitle">
                <Col span={5}>
                  <Title level={4}>Description</Title>
                </Col>
                <Col span={19}>
                  <Title level={4} style={{ color: "grey" }}>
                    (Optional)
                  </Title>
                </Col>
              </Row>
              <Row id="descriptionText">
                <TextArea
                  showCount
                  maxLength={150}
                  value={description}
                  style={styles.descriptionTextArea}
                  onChange={onDescriptionChange}
                />
              </Row>
            </div>
          </Row>

          <Row>
            <div id="createButton" style={styles.titleWrapper}>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={handleSubmit}
              >
                Create item
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default MemeNFTCreate;
