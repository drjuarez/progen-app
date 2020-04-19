import React from 'react';
import '../../styles/components/hover.scss';

const Hover = ({data, children}) => {
	return (
  <div className='info-hover'>
    <div className='info-hover__no-hover'>{children}</div>
    {data &&
    <div className='info-hover__hover'>
      <div className='hover-card-background'>
        <div className='inner-content'>
          {data}
        </div>
      </div>
    </div>
			}
  </div>
	);
};

export default Hover;
