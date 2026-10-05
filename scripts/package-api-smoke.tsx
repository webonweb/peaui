import Button, {
  type ButtonActionProps,
} from "@peaui/ui/react/data-entry/ButtonAction";
import Input from "@peaui/ui/react/form/FormInput";
import FileUpload from "@peaui/ui/react/form/FormFileUpload";
import { createRef } from "react";
import type { FormSelectElement } from "@peaui/ui/wc/form/FormSelect";
import type { FormSelectElement as ManifestSelectElement } from "@peaui/ui/dist/components/wc/form/FormSelect.js";
import Select from "@peaui/ui/react/form/FormSelect";
import type {
  TableColumn,
  TableManageColumn,
} from "@peaui/ui/react/data-display/TableList";
import type { TableColumn as VueTableColumn } from "@peaui/ui";
import type { TableColumn as WcTableColumn } from "@peaui/ui/wc/data-display/TableList";
import type { TableListProps } from "@peaui/ui/react/data-display/TableList";

const props: ButtonActionProps = { disabled: true, variant: "primary" };
<FileUpload onFileChange={(value) => { const file: File | undefined = value?.file; void file; }} />;
<FileUpload valueMode="file" onFileChange={(value: File | undefined) => { void value?.name; }} />;
<Button {...props} ref={createRef<HTMLElement>()}>
  Save
</Button>;
// @ts-expect-error Boolean props must reject strings.
<Button disabled="false" />;
// @ts-expect-error Component variants must remain a finite union.
<Button variant="not-a-variant" />;
// @ts-expect-error Unknown properties must not be accepted by the public component.
<Button madeUp={42} />;
// @ts-expect-error Form controls must retain their declared prop types too.
<Input disabled="false" />;

declare const select: InstanceType<typeof FormSelectElement>;
const manifestSelect: InstanceType<typeof ManifestSelectElement> = select;
manifestSelect.dataTestId = "manifest-select";
// @ts-expect-error Manifest imports must preserve the public property spelling.
manifestSelect.dataTestid = "invalid-property";
select.disabled = false;
select.labels = { empty: "No results" };
// @ts-expect-error WC properties must retain their boolean type.
select.disabled = "false";
// @ts-expect-error WC label names must be checked too.
select.labels = { madeUp: "Unknown" };

<Select
  id="value-select"
  name="value-select"
  options={[{ label: "Alpha", value: "a" }]}
  valueMode="value"
  virtual
  optionHeight={48}
/>;
<Select id="label-select" name="label-select" options={[]} valueMode="label" />;
<Select
  id="invalid-select"
  name="invalid-select"
  options={[]}
  // @ts-expect-error Migration mode must remain a finite union.
  valueMode="display"
/>;
select.valueMode = "label";
select.virtual = true;
// @ts-expect-error WC migration mode must have the same contract.
select.valueMode = "display";

const manage: TableManageColumn = {
  type: "select",
  valueMode: "label",
  options: [{ label: "Alpha", value: "a" }],
};
const column: TableColumn = { key: "status", label: "Status", manage };
const vueColumn: VueTableColumn = column;
void vueColumn;
const wcColumn: WcTableColumn = column;
void wcColumn;
const invalidManage: TableManageColumn = {
  type: "select",
  // @ts-expect-error The table editor shares the select migration mode.
  valueMode: "display",
};
void invalidManage;
const reactColumns: TableListProps["columns"] = [
  {
    key: "status",
    manage: {
      type: "select",
      // @ts-expect-error React table props must also reject unknown migration modes.
      valueMode: "display",
    },
  },
];
void reactColumns;
