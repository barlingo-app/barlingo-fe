import React from 'react';
import { Upload, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isImg) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isImg && isLt2M;
}
  
  class index extends React.Component {
    state = {
      loading: false,
    };

    constructor(props){
      super(props)
      const {imageUrl = ''} = props
      this.state = {
        loading: false,
        imageUrl: imageUrl
      }
    }
  
    handleChange = (info) => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => this.setState({
          imageUrl,
          loading: false,
        }));
      }
    }
  
    render() {
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div>Upload</div>
        </div>
      );
      const imageUrl = this.state.imageUrl;
      console.log("STATE fileUpload, ", this.state)
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          action="//jsonplaceholder.typicode.com/posts/"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
        </Upload>
      );
    }
  }

export default index

