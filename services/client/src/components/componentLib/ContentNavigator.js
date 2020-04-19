import React, { Component } from 'react';
import {ButtonToolbar, ToggleButton, ToggleButtonGroup} from 'reactstrap';

class ContentNavigator extends Component {
// PROPS
// contents: [{
//  id: string
//  title: string,
//  onEnter: () => {},
//  renderNode: React.Node
// }]
//
//
//
  constructor(props) {
    super(props);
    this.state = {
      activeContent: null
    };
    this.updateActiveContent = this.updateActiveContent.bind(this);
  }

  componentDidMount() {
    let activeContent = this.props.activeId || this.props.contents[0];
    this.setState({activeContent});
  }

  updateActiveContent(value) {
    const activeContent = this.props.contents[value];
    if(activeContent.onEnter) {
      activeContent.onEnter(activeContent.id);
    }
    this.setState({activeContent});
  }


  render() {
    const {contents, buttonGroupClassName} = this.props;
    return (
      <section>
        <div style={{display: 'flex', justifyContent: 'center'}} className='margin-bottom-10'>
          <ButtonToolbar>
            <ToggleButtonGroup
              onChange={this.updateActiveContent}
              type='radio'
              name='options'
              defaultValue={0}
              className={buttonGroupClassName}
            >
              {contents.map((content,i) => {
                return <ToggleButton
                  className={content.buttonClassName || ''}
                  key={i}
                  value={i}>{content.title}
                </ToggleButton>;
              })}
            </ToggleButtonGroup>
          </ButtonToolbar>
        </div>
        {this.state.activeContent && this.state.activeContent.renderNode}
      </section>
    );
  }

}

export default ContentNavigator;
