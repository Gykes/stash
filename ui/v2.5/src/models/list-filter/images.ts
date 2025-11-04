import {
  createMandatoryNumberCriterionOption,
  createMandatoryStringCriterionOption,
  createStringCriterionOption,
  createMandatoryTimestampCriterionOption,
  createDateCriterionOption,
  createRelativeDateCriterionOption,
} from "./criteria/criterion";
import { PerformerFavoriteCriterionOption } from "./criteria/favorite";
import { ImageIsMissingCriterionOption } from "./criteria/is-missing";
import { OrganizedCriterionOption } from "./criteria/organized";
import { PathCriterionOption } from "./criteria/path";
import { PerformersCriterionOption } from "./criteria/performers";
import { RatingCriterionOption } from "./criteria/rating";
import { ResolutionCriterionOption } from "./criteria/resolution";
import { OrientationCriterionOption } from "./criteria/orientation";
import { StudiosCriterionOption } from "./criteria/studios";
import {
  PerformerTagsCriterionOption,
  // StudioTagsCriterionOption,
  TagsCriterionOption,
} from "./criteria/tags";
import { ListFilterOptions, MediaSortByOptions } from "./filter-options";
import { DisplayMode } from "./types";
import { GalleriesCriterionOption } from "./criteria/galleries";

const defaultSortBy = "path";

const sortByOptions = ["filesize", "file_count", "date", ...MediaSortByOptions]
  .map(ListFilterOptions.createSortBy)
  .concat([
    {
      messageID: "o_count",
      value: "o_counter",
    },
  ]);
const displayModeOptions = [DisplayMode.Grid, DisplayMode.Wall];
const criterionOptions = [
  createStringCriterionOption("title"),
  createStringCriterionOption("code", "scene_code"),
  createStringCriterionOption("details"),
  createStringCriterionOption("photographer"),
  createMandatoryStringCriterionOption("checksum", "media_info.checksum"),
  PathCriterionOption,
  GalleriesCriterionOption,
  OrganizedCriterionOption,
  createMandatoryNumberCriterionOption("o_counter", "o_count"),
  ResolutionCriterionOption,
  OrientationCriterionOption,
  ImageIsMissingCriterionOption,
  TagsCriterionOption,
  RatingCriterionOption,
  createMandatoryNumberCriterionOption("tag_count"),
  PerformerTagsCriterionOption,
  PerformersCriterionOption,
  createMandatoryNumberCriterionOption("performer_count"),
  createMandatoryNumberCriterionOption("performer_age"),
  PerformerFavoriteCriterionOption,
  // StudioTagsCriterionOption,
  StudiosCriterionOption,
  createStringCriterionOption("url"),
  createDateCriterionOption("date"),
  createRelativeDateCriterionOption("date_relative", "date_relative"),
  createMandatoryNumberCriterionOption("file_count"),
  createMandatoryTimestampCriterionOption("created_at"),
  createRelativeDateCriterionOption("created_at_relative", "created_at_relative"),
  createMandatoryTimestampCriterionOption("updated_at"),
  createRelativeDateCriterionOption("updated_at_relative", "updated_at_relative"),
];
export const ImageListFilterOptions = new ListFilterOptions(
  defaultSortBy,
  sortByOptions,
  displayModeOptions,
  criterionOptions
);
