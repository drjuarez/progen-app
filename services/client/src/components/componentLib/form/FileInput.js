import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import CircleButton from '../CircleButton';
import CropLogo from '../../../styles/images/crop.svg';
import UploadPicIcon from '../../../styles/images/uploadPicture.svg';
import ThumbnailIcon from '../../../styles/images/ThumbnailIcon.svg';
import {addFormState} from '../../../utils/stateUtils';
import h from '../../../utils/helpers';

import '../../../styles/transitions.scss';
import '../../../styles/event-sections.scss';

class FileInput extends Component {
  // * Overview: Text Input To be used with Form
  // PROPS ---------------------------------------------------------------------
  // > Label value
  // > className
  // > groupClassName
  // > name
  // > placeholder
  // > type
  // > handleFieldUpdate-- Callback to be used before setting state
  // TODO: update this on mandatory
  // 1/6 Ratio for main , craom for

  // ---------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.saveCropAndGoTo = this.saveCropAndGoTo.bind(this);
    this.getCurrentStep = this.getCurrentStep.bind(this);
    this.moveToStep = this.moveToStep.bind(this);

    this.UPLOADSTEPNAME = 'Upload';
    this.PRIMARYCROPSTEPNAME = 'Primary';
    this.THUMBNAILCROPSTEPNAME = 'Thumbnail';
    this.FINALSTEPNAME = 'Final';
    this.initCropSteps = [
      {
        stepName: this.UPLOADSTEPNAME
      },
      {
        stepName: this.PRIMARYCROPSTEPNAME,
        crop: {
          aspect: 1.617,
          width: 30,
          x: 10,
          y: 10
        },
        pixelCrop: {}
      },
      {
        stepName: this.THUMBNAILCROPSTEPNAME,
        crop: {
          aspect: 1,
          width: 30,
          x: 10,
          y: 10
        },
        pixelCrop: {}
      },
      {
        stepName: this.FINALSTEPNAME
      }
    ];

    this.state = {
      currentStepName: this.UPLOADSTEPNAME,
      baseFile: null,
      cropSteps: this.initCropSteps
    };
  }

  componentDidMount() {
    // Determine if pictures are uploaded and will set thisstate.currentStepName accordingly
    const {primaryInitial, thumbInitial,
      FormHandlers, formName, primaryImageFieldName, thumbnailImageFieldName} = this.props;
    const form = FormState[formName];
    const newMainImageId = form && form[primaryImageFieldName];
    const newThumbImageId = form && form[thumbnailImageFieldName];

    let taskHasImages = (primaryInitial && thumbInitial) || (newMainImageId && newThumbImageId);
    if(taskHasImages) {
      const currentStepName = this.FINALSTEPNAME;
      this.setState({currentStepName});
    }

    FormHandlers.setFormState(formName, {fields: {
      [primaryImageFieldName]: newMainImageId || primaryInitial,
      [thumbnailImageFieldName]: newThumbImageId || primaryInitial
    }});
  }

  componentWillUnmount() {
    const {baseFile} = this.state;
    if(baseFile) {
      window.URL.revokeObjectURL(baseFile.preview);
    }
  }

  getCurrentStep() {
    const {currentStepName, cropSteps} = this.state;
    return cropSteps.find(step => step.stepName === currentStepName);
  }

  moveToStep(newStepName) {
    this.setState({currentStepName: newStepName});
  }

  async saveCropAndGoTo(nextStepName) {
    const {formName, FormHandlers, onImageSave,
      primaryImageFieldName, thumbnailImageFieldName} = this.props;
    let currentStep = this.getCurrentStep();
    const image = new Image();
    image.src = this.state.baseFile.preview;

    // Must dictate the image name for the service.
    let imageName, formFieldName = null;
    switch(currentStep.stepName) {
      case this.PRIMARYCROPSTEPNAME:
        imageName = 'primaryImage';
        formFieldName = primaryImageFieldName;
        break;
      case this.THUMBNAILCROPSTEPNAME:
        imageName = 'thumbnailImage';
        formFieldName = thumbnailImageFieldName;
        break;
    }

    // below utilitiy creates the image on an html canvase element.
    //    Send this binary to the server
    const cropped = await h.getCroppedImage(image, currentStep.pixelCrop, imageName);
    let res = await onImageSave(cropped);
    let {imageId} = res.entity;
    this.moveToStep(nextStepName);
    FormHandlers.updateFormField(formName, formFieldName, imageId);
  }

  handleCrop(crop, pixelCrop) {
    // Same process as handleDrop below
    let currentStep = this.getCurrentStep();
    currentStep.crop = crop;
    currentStep.pixelCrop = pixelCrop;
    this.setState(this.state.cropSteps);
  }

  handleDrop(uploadedFile) {
    const baseFile = uploadedFile[0];
    const cropSteps = this.initCropSteps;
    this.setState({baseFile, cropSteps});
    this.moveToStep(this.PRIMARYCROPSTEPNAME);
  }

  render() {
    const {className, label} = this.props;
    const {baseFile} = this.state;
    const currentStep = this.getCurrentStep();
    let renderNode = null;

    switch(currentStep.stepName) {
      case this.UPLOADSTEPNAME:
        renderNode = (
          <div key='section0' className='form-group'>
            <label>{label}</label>
            <div className='picture-load'>
              <Dropzone
                accept='image/*'
                onDrop={this.handleDrop}
                multiple={false}
                className={`${className} form-image-drop`}
              >
                <i className='fa fa-download fa-2x' /> <p>Drag file here to download</p>

              </Dropzone>
            </div>
          </div>
        );
        break;


      case this.PRIMARYCROPSTEPNAME:
        renderNode = (
          <section key='section1'>
            <section>
              <div>
                <ReactCrop
                  src={baseFile && baseFile.preview}
                  crop={currentStep.crop}
                  onChange={this.handleCrop}
                />
              </div>
              <div style={{display: 'flex'}}>
                <CircleButton
                  className='margin-right-20'
                  label={`Re-Upload`}
                  handleClick={(e)=>{
                    e.preventDefault();
                    this.moveToStep(this.UPLOADSTEPNAME);
                  }}
                  image={UploadPicIcon}
                  buttonType='warning'
                />
                <CircleButton
                  className='margin-right-20'
                  label={`Set Primary Image`}
                  handleClick={(e)=>{
                    e.preventDefault();
                    this.saveCropAndGoTo(this.THUMBNAILCROPSTEPNAME);
                  }}
                  image={CropLogo}
                />
              </div>
            </section>
          </section>
         );
         break;

      case this.THUMBNAILCROPSTEPNAME:
        renderNode = (
          <section key='section2'>
            <section>
              <div>
                <ReactCrop
                  src={baseFile && baseFile.preview}
                  crop={currentStep.crop}
                  onChange={this.handleCrop}
                />
              </div>
              <div style={{display: 'flex', justifyContent: ''}}>
                <CircleButton
                  className='margin-right-20'
                  label={`Re-Upload`}
                  handleClick={(e)=>{
                    e.preventDefault();
                    this.moveToStep(this.UPLOADSTEPNAME);
                  }}
                  image={UploadPicIcon}
                  buttonType='warning'
                />
                <CircleButton
                  className='margin-right-20'
                  label={`Re-Crop Primary Image`}
                  handleClick={(e)=>{
                    e.preventDefault();
                    this.moveToStep(this.PRIMARYCROPSTEPNAME);
                  }}
                  buttonType='warning'
                  image={CropLogo}
                />
                <CircleButton
                  className='margin-right-20'
                  label={`Set Thumbnail Image`}
                  handleClick={(e)=>{
                    e.preventDefault();
                    this.saveCropAndGoTo(this.FINALSTEPNAME);
                  }}
                  image={ThumbnailIcon}
                />
              </div>
            </section>
          </section>
        );
        break;
      case this.FINALSTEPNAME:
        const {formName, primaryImageFieldName, thumbnailImageFieldName, FormState} = this.props;
        const form = FormState[formName];
        let mainUrl = null;
        let thumbUrl = null;
        if(form) {
          mainUrl = '/adminApi/image/' + (form.fields[primaryImageFieldName] || this.props.primaryInitial);
          thumbUrl = '/adminApi/image/' + (form.fields[thumbnailImageFieldName] || this.props.thumbInitial);
        }
        renderNode = (
          <section>
            <div className='row'>
              <div className='col-sm-12'>
                <label>{label}</label>
                <p
                  className='link-styling margin-bottom-0'
                  onClick={(e)=>{
                    e.preventDefault();
                    this.moveToStep(this.UPLOADSTEPNAME);
                  }}
                >Upload New...</p>
              </div>
              <div className='col-sm-6'>
                <p className='margin-bottom-0'>Main Picture</p>
                <div className='picture-container primary-image'>
                  <img src={mainUrl} />
                </div>
              </div>
              <div className='col-sm-6'>
                <p className='margin-bottom-0'>Thumbnail Picture</p>
                <div className='picture-container thumbnail-image'>
                  <img src={thumbUrl} />
                </div>
              </div>
            </div>
          </section>
        );
    }

    return (
      // <ReactCSSTransitionGroup
      //   transitionName='file-upload'
      //   transitionEnterTimeout={100}
      //   transitionLeaveTimeout={100}
      //   transitionAppear={true}
      //   transitionAppearTimeout={100}
      // >
      <div className='form-group'>
        {renderNode}
      </div>
      // </ReactCSSTransitionGroup>
    );
  }
}

const wrappedInput = addFormState(FileInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
