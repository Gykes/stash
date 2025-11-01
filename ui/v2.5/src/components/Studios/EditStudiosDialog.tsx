import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { useBulkStudioUpdate } from "src/core/StashService";
import * as GQL from "src/core/generated-graphql";
import { ModalComponent } from "../Shared/Modal";
import { useToast } from "src/hooks/Toast";
import { MultiSet } from "../Shared/MultiSet";
import { RatingSystem } from "../Shared/Rating/RatingSystem";
import {
  getAggregateInputValue,
  getAggregateState,
  getAggregateStateObject,
} from "src/utils/bulkUpdate";
import { IndeterminateCheckbox } from "../Shared/IndeterminateCheckbox";
import { BulkUpdateTextInput } from "../Shared/BulkUpdateTextInput";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import * as FormUtils from "src/utils/form";
import { StudioSelect } from "../Shared/Select";

interface IListOperationProps {
  selected: GQL.SlimStudioDataFragment[];
  onClose: (applied: boolean) => void;
}

const studioFields = [
  "favorite",
  "rating100",
  "url",
  "details",
  "ignore_auto_tag",
];

export const EditStudiosDialog: React.FC<IListOperationProps> = (
  props: IListOperationProps
) => {
  const intl = useIntl();
  const Toast = useToast();
  const [tagIds, setTagIds] = useState<GQL.BulkUpdateIds>({
    mode: GQL.BulkUpdateIdMode.Add,
  });
  const [existingTagIds, setExistingTagIds] = useState<string[]>();
  const [aggregateState, setAggregateState] = useState<
    Partial<GQL.BulkStudioUpdateInput>
  >({});
  const [parentStudioId, setParentStudioId] = useState<string | undefined>();
  const [updateInput, setUpdateInput] = useState<
    Partial<GQL.BulkStudioUpdateInput>
  >({});

  const [updateStudios] = useBulkStudioUpdate(getStudioInput());

  // Network state
  const [isUpdating, setIsUpdating] = useState(false);

  function setUpdateField(input: Partial<GQL.BulkStudioUpdateInput>) {
    setUpdateInput({ ...updateInput, ...input });
  }

  function getStudioInput(): GQL.BulkStudioUpdateInput {
    const studioInput: GQL.BulkStudioUpdateInput = {
      ...updateInput,
      ids: props.selected.map((studio) => {
        return studio.id;
      }),
      tag_ids: tagIds,
    };

    // we don't have unset functionality for the rating star control
    // so need to determine if we are setting a rating or not
    studioInput.rating100 = getAggregateInputValue(
      updateInput.rating100,
      aggregateState.rating100
    );

    // handle parent studio
    studioInput.parent_id = getAggregateInputValue(
      parentStudioId,
      aggregateState.parent_id
    );

    return studioInput;
  }

  async function onSave() {
    setIsUpdating(true);
    try {
      await updateStudios();
      Toast.success(
        intl.formatMessage(
          { id: "toast.updated_entity" },
          {
            entity: intl.formatMessage({ id: "studios" }).toLocaleLowerCase(),
          }
        )
      );
      props.onClose(true);
    } catch (e) {
      Toast.error(e);
    }
    setIsUpdating(false);
  }

  useEffect(() => {
    const updateState: Partial<GQL.BulkStudioUpdateInput> = {};

    const state = props.selected;
    let updateTagIds: string[] = [];
    let updateParentStudioId: string | undefined | null = undefined;
    let first = true;

    state.forEach((studio: GQL.SlimStudioDataFragment) => {
      getAggregateStateObject(updateState, studio, studioFields, first);

      const studioTagIDs = (studio.tags ?? []).map((p) => p.id).sort();

      updateTagIds = getAggregateState(updateTagIds, studioTagIDs, first) ?? [];

      const thisParentStudioId = studio.parent_studio?.id;
      updateParentStudioId = getAggregateState(
        updateParentStudioId,
        thisParentStudioId,
        first
      );

      first = false;
    });

    setExistingTagIds(updateTagIds);
    setParentStudioId(updateParentStudioId ?? undefined);

    // Add parent_id to aggregate state for proper clearing behavior
    updateState.parent_id = updateParentStudioId ?? undefined;

    setAggregateState(updateState);
    setUpdateInput(updateState);
  }, [props.selected]);

  function renderTextField(
    name: string,
    value: string | undefined | null,
    setter: (newValue: string | undefined) => void
  ) {
    return (
      <Form.Group controlId={name}>
        <Form.Label>
          <FormattedMessage id={name} />
        </Form.Label>
        <BulkUpdateTextInput
          value={value === null ? "" : value ?? undefined}
          valueChanged={(newValue) => setter(newValue)}
          unsetDisabled={props.selected.length < 2}
        />
      </Form.Group>
    );
  }

  function render() {
    return (
      <ModalComponent
        dialogClassName="edit-studios-dialog"
        show
        icon={faPencilAlt}
        header={intl.formatMessage(
          { id: "actions.edit_entity" },
          { entityType: intl.formatMessage({ id: "studios" }) }
        )}
        accept={{
          onClick: onSave,
          text: intl.formatMessage({ id: "actions.apply" }),
        }}
        cancel={{
          onClick: () => props.onClose(false),
          text: intl.formatMessage({ id: "actions.cancel" }),
          variant: "secondary",
        }}
        isRunning={isUpdating}
      >
        <Form.Group controlId="rating" as={Row}>
          {FormUtils.renderLabel({
            title: intl.formatMessage({ id: "rating" }),
          })}
          <Col xs={9}>
            <RatingSystem
              value={updateInput.rating100}
              onSetRating={(value) =>
                setUpdateField({ rating100: value ?? undefined })
              }
              disabled={isUpdating}
            />
          </Col>
        </Form.Group>
        <Form>
          <Form.Group controlId="favorite">
            <IndeterminateCheckbox
              setChecked={(checked) => setUpdateField({ favorite: checked })}
              checked={updateInput.favorite ?? undefined}
              label={intl.formatMessage({ id: "favourite" })}
            />
          </Form.Group>

          {renderTextField("url", updateInput.url, (v) =>
            setUpdateField({ url: v })
          )}
          {renderTextField("details", updateInput.details, (v) =>
            setUpdateField({ details: v })
          )}

          <Form.Group controlId="parent_studio" as={Row}>
            {FormUtils.renderLabel({
              title: intl.formatMessage({ id: "parent_studio" }),
            })}
            <Col xs={9}>
              <StudioSelect
                onSelect={(items) =>
                  setParentStudioId(items.length > 0 ? items[0]?.id : undefined)
                }
                ids={parentStudioId ? [parentStudioId] : []}
                isDisabled={isUpdating}
                menuPortalTarget={document.body}
              />
            </Col>
          </Form.Group>

          <Form.Group controlId="tags">
            <Form.Label>
              <FormattedMessage id="tags" />
            </Form.Label>
            <MultiSet
              type="tags"
              disabled={isUpdating}
              onUpdate={(itemIDs) => setTagIds({ ...tagIds, ids: itemIDs })}
              onSetMode={(newMode) => setTagIds({ ...tagIds, mode: newMode })}
              existingIds={existingTagIds ?? []}
              ids={tagIds.ids ?? []}
              mode={tagIds.mode}
              menuPortalTarget={document.body}
            />
          </Form.Group>

          <Form.Group controlId="ignore-auto-tags">
            <IndeterminateCheckbox
              label={intl.formatMessage({ id: "ignore_auto_tag" })}
              setChecked={(checked) =>
                setUpdateField({ ignore_auto_tag: checked })
              }
              checked={updateInput.ignore_auto_tag ?? undefined}
            />
          </Form.Group>
        </Form>
      </ModalComponent>
    );
  }

  return render();
};
