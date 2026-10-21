import {JsonPipe} from '@angular/common';
import {Component, signal} from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import {TuiButton, TuiDropdown, TuiInput} from '@taiga-ui/core';
import {TuiChevron, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';

interface EmployeeDraft {
  readonly fullName: string;
  readonly email: string;
  readonly team: string;
}

@Component({
  selector: 'app-webmcp-signal-form',
  imports: [
    FormField,
    FormRoot,
    JsonPipe,
    TuiButton,
    TuiChevron,
    TuiDataListWrapper,
    TuiDropdown,
    TuiInput,
    TuiSelect,
  ],
  templateUrl: './signal-form.component.html',
})
export class WebMcpSignalForm {
  protected readonly teams = ['Platform', 'Infrastructure', 'Design Systems'] as const;
  protected readonly lastSaved = signal<EmployeeDraft | null>(null);
  protected readonly model = signal<EmployeeDraft>({fullName: '', email: '', team: ''});

  protected readonly employeeForm = form(
    this.model,
    (path) => {
      required(path.fullName, {message: 'Full name is required.'});
      minLength(path.fullName, 2, {message: 'Enter at least two characters.'});
      required(path.email, {message: 'Email is required.'});
      email(path.email, {message: 'Enter a valid email address.'});
      required(path.team, {message: 'Choose a team.'});
      validate(path.team, ({value}) =>
        this.teams.some((team) => team === value())
          ? null
          : {kind: 'teamNotAllowed', message: 'Select a team from the list.'},
      );
    },
    {
      experimentalWebMcpTool: {
        name: 'saveDemoEmployeeDraft',
        description:
          'Validate and save a local employee draft in the Taiga WebMCP demo. Does not contact a server.',
      },
      submission: {
        action: async (field) => {
          this.lastSaved.set({...field().value()});
        },
      },
    },
  );
}
