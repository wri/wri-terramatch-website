import React, { useState, useEffect } from 'react';
import FormInput from '../../components/formInput/FormInput';
import { Button } from 'tsc-chameleon-component-library';
import ProgressRing from '../../components/progressRing/ProgressRing';
import Spinner from '../../components/savingIndicator/Spinner';
import SavingIndicator from '../../components/savingIndicator/SavingIndicator';

export default (props) => {
  const [toggleActive, setToggleActive] = useState(false);
  const [fakeFileSuccess, setFakeFileSuccess] = useState(false);
  const [fakeFileInProgess, setFakeFileInProgess] = useState(false);
  const [fakeFileName, setFakeFileName] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progress => {
        let newProgress = progress + 1;
        return newProgress > 12 ? 0 : newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="u-flex u-flex--row u-flex--break-md">
        <form className="c-form u-margin-small" style={{maxWidth: '350px'}}>
          <h2>Form Example</h2>
          <FormInput
            className="u-margin-bottom-small"
            id="text-example"
            label="Example text input"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-disabled-example"
            label="Example diasabled text input"
            disabled
            value="Disabled text"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-error-example"
            label="Example text input"
            errorText="This field has an error!"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-prefilled-example"
            label="Example diasabled text input"
            value="This is already prefilled"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-placeholder-example"
            label="Example placeholder text input"
            placeholder="Has placeholder input"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-email-example"
            label="Example email input"
            value="myemail@anemail.com"
            type="email"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="text-password-example"
            label="Example password input"
            value="supersecretpassword"
            type="password"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="textarea-example"
            label="Example textarea"
            type="textarea"
            showLabel
          />

          <FormInput
            className="u-margin-bottom-small"
            id="textarea-error-example"
            label="Example textarea with error"
            type="textarea"
            errorText="This field has an error!"
            showLabel
          />

          <FormInput
            className="u-margin-bottom-small"
            id="textarea-disabled-example"
            label="Example textarea disabled"
            type="textarea"
            showLabel
            disabled
          />

          <FormInput
            className="u-margin-bottom-small"
            id="textarea-placeholder-example"
            label="Example textarea placeholder"
            type="textarea"
            showLabel
            placeholder="Some placeholder text"
          />

          <FormInput
            className="u-margin-bottom-small"
            id="textarea-prefilled-example"
            label="Example textarea prefilled"
            type="textarea"
            showLabel
            value="Oh look, some text."
          />

          <FormInput
            type="toggle"
            label="Toggle"
            id="toggle"
            className="u-margin-bottom-small"
            showLabel
            value={toggleActive}
            onChange={() => {setToggleActive(!toggleActive)}}
          />

          <FormInput
            type="checkbox"
            label="Checkbox"
            id="checkbox"
            className="u-margin-bottom-small"
            showLabel
            value={toggleActive}
            onChange={() => {setToggleActive(!toggleActive)}}
          />

          <FormInput
            type="radio"
            label="Radio"
            id="radio"
            className="u-margin-bottom-small"
            showLabel
            value={toggleActive}
            onChange={() => {setToggleActive(!toggleActive)}}
          />

          <FormInput
            type="asyncSelect"
            resource="/countries"
            label="Dropdown that fetches content from a server"
            id="async-select"
            asyncValue="code"
            asyncLabel="name"
            showLabel
            className="u-margin-bottom-small"
          />

          <FormInput
            type="radioGroup"
            label="Radio Group"
            id="radiogroup"
            className="u-margin-bottom-small"
            showLabel
            data={[
              {
                value: '1',
                label: 'Option 1'
              },
              {
                value: '2',
                label: 'Option 2'
              },
              {
                value: '3',
                label: 'Option 3'
              }
            ]}
            onChange={() => {}}
          />
        </form>
        <div className="u-margin-small">
          <h2>
            Button examples
          </h2>
          <h3>
            Normal size
          </h3>
          <Button className="u-margin-small">Standard Example</Button> <br/>
          <Button className="u-margin-small" disabled>Inactive</Button> <br/>
          <Button className="u-margin-small" icon iconName="arrow-right">With icon</Button> <br/>
          <Button className="u-margin-small" variant="secondary">Secondary</Button> <br/>
          <Button className="u-margin-small" variant="link">Button as a link</Button>
        <h3>
            Small
          </h3>
          <Button className="u-margin-small c-button--small">Standard</Button> <br/>
          <Button className="u-margin-small c-button--small" disabled>Inactive</Button> <br/>
          <Button className="u-margin-small c-button--small" icon iconName="arrow-right">Icon</Button> <br/>
          <Button className="u-margin-small c-button--small" variant="secondary">Secondary</Button> <br/>
        </div>
        <div className="u-margin-small">
          <h2>
            File upload
          </h2>
          <FormInput
            type="file"
            label="file-upload"
            id="fileupload"
            className="u-margin-bottom-small"
            showLabel
            busy={fakeFileInProgess}
            success={fakeFileSuccess}
            fileName={fakeFileName}
            onChange={(e) => {
              setFakeFileInProgess(true);
              setFakeFileName(e.target.files[0].name);
              setTimeout(() => {
                // Simulate a wait.
                setFakeFileInProgess(false);
                setFakeFileSuccess(true);
              }, 1500);
            }}
          />
          <div className="u-margin-top-small">
            <h2>
              Progress Ring
            </h2>
            <ProgressRing
              radius={40}
              progress={progress}
              progressMax={12}
              showOutOf
              pointerRadius={7.3}
              strokeWidth={5.6}
              trackStrokeWidth={5.6}
              unitText="match"
            />
          </div>
          <div className="u-margin-top-small">
            <h2>
              Spinner
            </h2>
            <Spinner />
          </div>
          <div className="u-margin-top-small">
            <h2>
              Saving Indicator
            </h2>
            <SavingIndicator className="u-margin-bottom-small" isSaving />
            <SavingIndicator className="u-margin-bottom-small" isError />
            <SavingIndicator className="u-margin-bottom-small" isSaved />
          </div>
        </div>

      </div>
    </>
  );
}
