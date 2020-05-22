/**
 * Date: 2019-07-12
 * Time: 21:26
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {immutable} from "../mutation";
import {LogMessage, Severity, testSeverity} from "../types";


/**
 * This is only a base class implementation. The finer details of how logging is implemented will differ per
 * platform. The idea is that this class encapsulates the broad strokes. There will be override points and
 * they will clearly be labelled
 */
export abstract class LogBase {
	public readonly applicationId: string;
	public readonly environmentId: string;
	public readonly sortMetadata: boolean;
	public readonly threshold: Severity;

	constructor({
		applicationId,
		environmentId,
		sortMetadata = true,
		threshold = Severity.DEBUG
	}: {
		applicationId: string,
		environmentId: string,
		sortMetadata?: boolean,
		threshold?: Severity
	}) {
		this.applicationId = applicationId;
		this.environmentId = environmentId;
		this.sortMetadata = sortMetadata;
		this.threshold = threshold;
	}

	/********************* Public Interface *********************/
	public debug(message: LogMessage, {metadata, moduleId, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.DEBUG,
			traceId
		});
	}

	public error(message: LogMessage, {metadata, moduleId, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.ERROR,
			traceId
		});
	}

	public fatal(message: LogMessage, {metadata, moduleId, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.FATAL,
			traceId
		});
	}

	public info(message: LogMessage, {metadata, moduleId, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.INFO,
			traceId
		});
	}

	public warn(message: LogMessage, {metadata, moduleId, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.WARN,
			traceId
		});
	}

	/********************* Protected Interface *********************/
	/**
	 * Derived classes should implement this method
	 */
	protected abstract _logEntry(message: string, severity: Severity, metadata: {[index: string]: any}): void;


	/********************* Private Interface *********************/
	/**
	 * @param {string|function():string} message
	 * @param {Object} metadata
	 * @param {string} moduleId
	 * @param {Severity} severity
	 * @param {string|undefined} traceId
	 * @private
	 */
	private _processEntry(message: LogMessage, {
		metadata,
		moduleId,
		severity,
		traceId
	}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		severity: Severity,
		traceId?: string
	}) {
		if(testSeverity(severity, this.threshold)) {
			if(typeof message === "function") {
				message = message();
			}
			this._logEntry(message, severity, _.omitBy({
				applicationId: this.applicationId,
				environmentId: this.environmentId,
				metadata: (this.sortMetadata)
					? immutable.object.sort(metadata)
					: metadata,
				moduleId,
				severity,
				timestamp: new Date(),
				traceId
			}, _.isUndefined));
		}
	}
}
