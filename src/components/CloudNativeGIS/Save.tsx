import React, { useEffect, useState } from 'react';
import { MdOutlineSave } from "react-icons/md";
import Modal from '../Modal'
import { ToolbarAction } from '../AppToolbar.tsx'
import InputString from "../InputString.tsx";
import InputButton from "../InputButton.tsx";
import InputCheckbox from "../InputCheckbox.tsx";
import { StyleProps } from "./Main.tsx";

declare global {
  interface Window {
    csrfmiddlewaretoken: any;
  }
}
type ModalOpenProps = {
  style?: StyleProps
  mapStyle: object
};

export default function CloudNativeGISSave(props: ModalOpenProps) {
  const styleName = props.style?.name
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [saving, setSaving] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);

  // When props is changed
  useEffect(() => {
    if (props.style) {
      setName(props.style.name)
    }
  }, [props.style])

  const clearError = () => {
    setError(null)
  }

  const onOpenToggle = () => {
    clearError()
    setIsOpen(!isOpen)
  }

  const submit = (event: React.FormEvent) => {
    if (!props.style?.style_url) {
      event.preventDefault();
      return
    }
    // @ts-ignore
    const saveAs = event.nativeEvent.submitter.className.includes('save-as-button')
    const data = {
      name: name,
      isDefault: isDefault,
      style: props.mapStyle,
      saveAs: saveAs
    }
    setSaving(true)
    fetch(props.style.style_url, {
      mode: 'cors',
      credentials: "same-origin",
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': window.csrfmiddlewaretoken
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json()
    }).then(function () {
      window.location.reload()
    }).catch((err) => {
      setError(`${err}`);
    }).finally(() => {
      setSaving(false)
    });
    event.preventDefault();
  }

  let errorElement;
  if (error) {
    errorElement = (
      <div className="maputnik-modal-error">
        {error}
        <a
          href="#" onClick={() => clearError()}
          className="maputnik-modal-error-close">×</a>
      </div>
    );
  }
  return (
    <>
      <ToolbarAction onClick={onOpenToggle}>
        <MdOutlineSave/>
        <span className="maputnik-icon-text">Save</span>
      </ToolbarAction>
      <Modal
        data-wd-key="modal:open"
        isOpen={isOpen}
        onOpenToggle={() => onOpenToggle()}
        title={'Save style - ' + styleName}
      >
        {errorElement}

        <section className="maputnik-modal-section">
          <form onSubmit={submit}>
            <h1>Name</h1>
            <InputString
              value={name ? name : ''}
              onInput={value => setName(value)}
              disabled={saving}
            />
            <p>Change to override</p>
            <br/>
            <h1>Is default</h1>
            <InputCheckbox
              value={isDefault}
              onChange={evt => setIsDefault(!!evt)}
              disabled={saving}
            />
            <br/>
            <div>
              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button save-button"
                disabled={!props.mapStyle || saving}
              >
                Save
              </InputButton>

              <span style={{ margin: "0 2px" }}/>

              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button save-as-button"
                disabled={!props.mapStyle || saving}
              >
                Save as
              </InputButton>
            </div>
            {
              saving ? <>
                <br/>
                <span>Saving...</span>
              </> : null
            }
          </form>
        </section>
      </Modal>
    </>
  )
}
