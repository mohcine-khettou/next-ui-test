import {
  Avatar,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import HeroUITable from "./HeroUiTable";
import HeroUiModal from "./Modal";
import Calendar from "./Calendar";
import DropdownUi from "./DropdownUi";
import TabsUi from "./TabsUi";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button> click on me</Button>
      <Spinner />
      <HeroUITable />
      <Calendar />
      <HeroUiModal />
      <RadioGroup label="Select your favorite city">
        <Radio value="buenos-aires">Buenos Aires</Radio>
        <Radio value="sydney">Sydney</Radio>
        <Radio value="san-francisco">San Francisco</Radio>
        <Radio value="london">London</Radio>
        <Radio value="tokyo">Tokyo</Radio>
      </RadioGroup>
      <CheckboxGroup
        defaultValue={["buenos-aires", "london"]}
        label="Select cities"
      >
        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="san-francisco">San Francisco</Checkbox>
        <Checkbox value="london">London</Checkbox>
        <Checkbox value="tokyo">Tokyo</Checkbox>
      </CheckboxGroup>
      <div className="flex items-center gap-4">
        <DropdownUi />
      </div>
      <TabsUi />
    </main>
  );
}
