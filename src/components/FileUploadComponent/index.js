import React from 'react';
import { Upload, Icon, message } from 'antd';
import { auth } from '../../auth';
import './styles.scss';
import { withRouter } from 'react-router-dom';


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
        token: null,
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
        auth.setUserData(info.file.response.content);

        let imageUrl = info.file.response.content[this.props.imageType];
        if (imageUrl.constructor === Array) {
          imageUrl = imageUrl[0];
        }

        this.setState({imageUrl: imageUrl});
      }
    }

    getImage = (image) => {
      return (image === '' || image === null) ? this.props.defaultImage : image;
    };

    componentDidMount() {
      auth.getToken().then(token => {
        this.setState({token: token});
      });
    }
  
    render() {
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div>Upload</div>
        </div>
      );
      const imageUrl = this.state.imageUrl;

      if (this.props.allowUpload !== true) {
        return (
          <img style={{height: this.props.height, width: this.props.width, maxWidth: "100%" }}src={this.getImage(imageUrl)} alt="avatar"  onError={(e) => {e.target.src = this.props.defaultImage}} />
        )
      }

      return (
        <div className={(this.props.full ? "full" : "")}>
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            action={process.env.REACT_APP_BE_URL + this.props.endpoint}
            headers={{"Authorization": "Bearer " + this.state.token}}
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img style={{height: this.props.height, width: this.props.width, maxWidth: "100%" }}src={this.getImage(imageUrl)} alt="avatar"  onError={(e) => {e.target.src = this.props.defaultImage}} /> : uploadButton}
          </Upload>
          </div>
      );
    }
  }

export default withRouter(index);

