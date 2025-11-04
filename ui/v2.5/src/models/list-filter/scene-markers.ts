import { PerformersCriterionOption } from "./criteria/performers";
import { MarkersScenesCriterionOption } from "./criteria/scenes";
import { SceneTagsCriterionOption, TagsCriterionOption } from "./criteria/tags";
import { ListFilterOptions } from "./filter-options";
import { DisplayMode } from "./types";
import {
  createDateCriterionOption,
  createMandatoryTimestampCriterionOption,
  createNullDurationCriterionOption,
  createRelativeDateCriterionOption,
} from "./criteria/criterion";

const defaultSortBy = "title";
const sortByOptions = [
  "duration",
  "title",
  "seconds",
  "scene_id",
  "random",
  "scenes_updated_at",
].map(ListFilterOptions.createSortBy);
const displayModeOptions = [DisplayMode.Grid, DisplayMode.Wall];
const criterionOptions = [
  TagsCriterionOption,
  MarkersScenesCriterionOption,
  SceneTagsCriterionOption,
  PerformersCriterionOption,
  createNullDurationCriterionOption("duration"),
  createMandatoryTimestampCriterionOption("created_at"),
  createRelativeDateCriterionOption("created_at_relative", "created_at_relative"),
  createMandatoryTimestampCriterionOption("updated_at"),
  createRelativeDateCriterionOption("updated_at_relative", "updated_at_relative"),
  createDateCriterionOption("scene_date"),
  createRelativeDateCriterionOption("scene_date_relative", "scene_date_relative"),
  createMandatoryTimestampCriterionOption("scene_created_at"),
  createRelativeDateCriterionOption("scene_created_at_relative", "scene_created_at_relative"),
  createMandatoryTimestampCriterionOption("scene_updated_at"),
  createRelativeDateCriterionOption("scene_updated_at_relative", "scene_updated_at_relative"),
];

export const SceneMarkerListFilterOptions = new ListFilterOptions(
  defaultSortBy,
  sortByOptions,
  displayModeOptions,
  criterionOptions
);
