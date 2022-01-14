import React from 'react'
import { Typography } from 'antd';
import { Row, Col, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title } = Typography;

const styles = {
  fileUpload: {
    margin: "15px",
    paddingRight: "15px",
    justifyContent: "center",
    alignItems: "center",
  }
}

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const MemeNFTCreate = () => {
  return (
    <div>
      <Title>Create your meme as an NFT</Title>
      <Row>
        <Col span={18}>
          <Row>
            <Title level={4}>Upload file</Title>
            <Col span={20} offset={2}>
              <div style={styles.fileUpload}>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                  </p>
                </Dragger>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>Preview</Col>
      </Row>
    </div>
  )
}

export default MemeNFTCreate
