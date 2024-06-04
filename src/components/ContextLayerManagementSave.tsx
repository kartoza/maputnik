import React, { useEffect, useState } from 'react';
import Modal from './Modal'
import { StyleSpecification } from "maplibre-gl";
import InputString from "./InputString.tsx";
import InputButton from "./InputButton.tsx";
import InputCheckbox from "./InputCheckbox.tsx";


type ModalOpenProps = {
  isOpen: boolean
  style: StyleSpecification & { id: string }
  onOpenToggle(...args: unknown[]): unknown
};

export default function ContextLayerManagementSave(props: ModalOpenProps) {
  const url = new URL(document.URL);
  const styleUrl = '' + url.searchParams.get('styleUrl');

  const [name, setName] = useState<string | undefined>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [saving, setSaving] = useState<boolean>(false);

  // When props is changed
  useEffect(() => {
    if (!name && props.style?.name) {
      setName(props.style.name)
    }
  }, [name, props.style?.name])

  const clearError = () => {
    setError(null)
  }

  const onOpenToggle = () => {
    clearError();
    props.onOpenToggle();
  }

  const submit = (event) => {
    const data = {
      name: name,
      isDefault: isDefault,
      style: props.style
    }
    setSaving(true)

    fetch(styleUrl, {
      mode: 'cors',
      credentials: "same-origin",
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json()
    }).then(function (response) {
      window.location = response
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
    <div>
      <Modal
        data-wd-key="modal:open"
        isOpen={props.isOpen}
        onOpenToggle={() => onOpenToggle()}
        title={'Save style (' + props.style?.name + ')'}
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
              onChange={evt => setIsDefault(evt)}
              disabled={saving}
            />
            <br/>
            <div>
              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button"
                disabled={!props.style || saving}
              >
                Save
              </InputButton>
              <span style={{ margin: "0 2px" }}/>
              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button"
                disabled={!props.style || saving}
              >
                Save as and make it default
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
    </div>
  )
}
