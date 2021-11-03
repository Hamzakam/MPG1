import React, {Component} from 'react';
import {Icon, Dialog} from '@material-ui/core';
import Loader from '../loader';
import './styles.css';

export default class StatusMessage extends Component {
  render() {
    const {
      loading,
      loadingClassName,
      loadingMessage,
      error,
      errorClassName,
      errorMessage,
      success,
      successClassName,
      successMessage,
      nothing,
      nothingClassName,
      nothingMessage,
      type,
    } = this.props;

    if (loading) {
      if (type === 'modal') {
        return (
          <div className={loadingClassName || 'statusMessage-modal'}>
            <Dialog attached icon>
              <Dialog.Content>
                <Icon name="circle notched" loading size="big" />
                {loadingMessage || 'Loading ...'}
              </Dialog.Content>
            </Dialog>
          </div>
        );
      }
      return (
        <div className={loadingClassName || 'statusMessage-default'}>
          <Loader/>
          <br />
          <Dialog size="tiny">
            <Dialog.Content>
              <Dialog.Header>Just few seconds</Dialog.Header>
              {loadingMessage || 'We are fetching the content for you.'}
            </Dialog.Content>
          </Dialog>
        </div>
      );
    } else if (error) {
      if (type === 'modal') {
        return (
          <div className={errorClassName || 'statusMessage-modal'}>
            <Dialog attached error icon>
              <Dialog.Content>
                <Icon name="thumbs outline down" size="big" />
                {errorMessage || error || 'Sorry, something went wrong'}
              </Dialog.Content>
            </Dialog>
          </div>
        );
      }
      return (
        <div className={errorClassName || 'statusMessage-default'}>
          <Dialog error>
            <Dialog.Content>
              <Icon name="thumbs outline down" size="big" />
              {errorMessage || error || 'Sorry, something went wrong'}
            </Dialog.Content>
          </Dialog>
        </div>
      );
    } else if (success) {
      if (type === 'modal') {
        return (
          <div className={successClassName || 'statusMessage-modal'}>
            <Dialog attached positive icon>
              <Dialog.Content>
                <Icon name="thumbs outline up" size="big" />
                {successMessage || 'Successful'}
              </Dialog.Content>
            </Dialog>
          </div>
        );
      }
      return (
        <div className={successClassName || 'statusMessage-default'}>
          <Dialog positive>
            <Dialog.Content>
              <Icon name="thumbs outline up" size="big" />
              {successMessage || 'Successful'}
            </Dialog.Content>
          </Dialog>
        </div>
      );
    } else if (nothing) {
      if (type === 'modal') {
        return (
          <div className={nothingClassName || 'statusMessage-modal'}>
            <Dialog attached error icon>
              <Dialog.Content>
                <Icon name="thumbs outline down" size="big" />
                {nothingMessage || 'Successful'}
              </Dialog.Content>
            </Dialog>
          </div>
        );
      }
      return (
        <div className={nothingClassName || 'statusMessage-default'}>
          <Dialog error>
            <Dialog.Content>
              <Icon name="thumbs outline down" size="big" />
              {nothingMessage || 'Nothing to display'}
            </Dialog.Content>
          </Dialog>
        </div>
      );
    }
    return null;
  }
}
