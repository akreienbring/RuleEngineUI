# RuleEngineUI

![license](https://img.shields.io/badge/license-MIT-orange)

An userinterface for [Rule-Engine-JS](https://github.com/crafts69guy/rule-engine-js).

## Overview

RuleEngineUI offers two visual user interfaces for creating rules for Rule-Engine-JS (rule-engine-js-ui) and a Test Application with many examples how to implement and use them (RuleDesigner).

## General features

- **Create rules**<br/>
  The visual interfaces allow to create rules from reading JSON schemas of objects by converting the object properties to input fields. For every property an rule operator can be selected (e.g. 'eq', 'neq', 'gt', 'contains'...). The operators correspond to the type of the property (e.g. 'number', 'string', 'boolean').
  While selecting properties and operators, the rule is build in the background and visually presented in the UI.
  Created rules can be saved for later usage by handing them over to the application that uses the UI.

## Features of the Simple UI

- **Assitant like guidance**<br/>
  This UI is intendet to create less complex rules (without subrules). The user is led through the process from selecting a schema to saving the rule.

- **Customizable**<br/>
  Addons can be injected into the component to extend the functionality. See the RuleDesigner application for reference.

## Features of the Full UI

- **Complex rules**<br/>  
  Here it is possible to create subrules of any depth. Allows also for more than one operator per property.

- **Rule testing while building**<br/>
  While constructing the rule it is permanently tested against a given test object. The evaluation result is presented visually.

## What to use RuleDesigner for?

- **Implementation examples**<br/>
  It's recommendet to use RuleDesigner for learning how to implement RuleEngineUIJS. Examples of objects and schemas are provided, ready to start with the simple- and the full UI. There's also a 'playground' that demonstrates the usage of the stateful engine of [Rule-Engine-JS](https://github.com/crafts69guy/rule-engine-js/blob/production/docs/essentials/stateful-engine.mdx)

## Screenshots

![Simple UI](screens/simple_ui.png)

![Full UI](screens/full_ui.png)

![Stateful Playground](screens/playground.png)
