import {blockContent} from './blockContent'
import {event} from './event'
import {figure} from './figure'
import {newsPost} from './newsPost'
import {page} from './page'
import {person} from './person'
import {program} from './program'
import {siteSettings} from './siteSettings'

/**
 * Schema v1.
 *
 * Six document types and two shared objects. Documented in plain language in
 * docs/content-model.md — keep the two in step.
 *
 * Adding a document type is a decision, not a detail: record it in
 * docs/decisions.md with the reason. Before adding one, check whether it could
 * be a field on a type that already exists.
 */
export const schemaTypes = [
  // Documents
  event,
  newsPost,
  program,
  page,
  person,
  siteSettings,

  // Shared objects
  blockContent,
  figure,
]
