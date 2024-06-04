import React from 'react'
import Modal from './Modal'


type ModalOpenProps = {
  isOpen: boolean
  onOpenToggle(...args: unknown[]): unknown
  onStyleOpen(...args: unknown[]): unknown
};

type ModalOpenState = {
  error?: string | null
};

export default class ContextLayerManagementSave extends React.Component<ModalOpenProps, ModalOpenState> {
  constructor(props: ModalOpenProps) {
    super(props);
    this.state = {
      error: null
    }
  }

  clearError() {
    this.setState({
      error: null
    })
  }

  onOpenToggle() {
    this.clearError();
    this.props.onOpenToggle();
  }

  render() {
    let errorElement;
    if (this.state.error) {
      errorElement = (
        <div className="maputnik-modal-error">
          {this.state.error}
          <a
            href="#" onClick={() => this.clearError()}
            className="maputnik-modal-error-close">×</a>
        </div>
      );
    }

    return (
      <div>
        <Modal
          data-wd-key="modal:open"
          isOpen={this.props.isOpen}
          onOpenToggle={() => this.onOpenToggle()}
          title={'Save as'}
        >
          {errorElement}
        </Modal>
      </div>
    )
  }
}

