import { createValidator, required, minLength, maxLength, url } from 'utils/validation';
import { ecocasesForm } from 'constants/form';

const ecocaseValidation = createValidator({
  title: [required, minLength(ecocasesForm.titleMinLength), maxLength(ecocasesForm.titleMaxLength)],
  link: [required, url]
});
export default ecocaseValidation;
