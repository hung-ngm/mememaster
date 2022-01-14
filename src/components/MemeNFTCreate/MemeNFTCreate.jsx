import React, { useState } from 'react'
import { Row, Col, Upload, message, Typography, Input, Tooltip } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title } = Typography;

const formatNumber = (value) => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

const styles = {
  fileUpload: {
    margin: "15px",
    paddingRight: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    padding: "10px",
  }
}

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    console.log(info);
    const { status } = info.file;
    console.log(status);
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

const NumericInput = (props) => {
  const onPriceChange = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  const onBlur = () => {
    const { value, onBlur, onChange } = props;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onPriceChange(valueTemp.replace(/0*(\d+)/, '$1'));
    if (onBlur) {
      onBlur();
    }
  };
  const { value, onChange } = props;
  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(value) : '-'}</span>
  ) : (
    'Input a number'
  );
  return (
    <Tooltip
      trigger={['focus']}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Input a number"
        maxLength={25}
      />
    </Tooltip>
  );

}

const MemeNFTCreate = () => {
  const [value, setValue] = useState(0);
  const onChange = (value) => {
    setValue(value);
  }
  
  return (
    <div>
      <Title>Create your meme as an NFT</Title>
      <Row>
        <Col span={18}>
          <Row>
            <div id="fileUpload" style={styles.titleWrapper}>
              <Title level={4}>Upload file</Title>
              <Col span={20} offset={2} style={styles.fileUpload}>
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
              </Col>
            </div>

            <div id="price" style={styles.titleWrapper}>
              <Title level={4}>Price</Title>
              <Col span={24}>
                <NumericInput style={{ width: '100%' }} value={value} onChange={onChange} />
              </Col>
              
            </div>
            <div id="name"></div>
            <div id="description"></div>
            
          </Row>
        </Col>
        <Col span={6}>Preview</Col>
      </Row>
    </div>
  )
}

export default MemeNFTCreate
