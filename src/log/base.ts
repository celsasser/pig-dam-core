/**
 * Date: 2019-07-12
 * Time: 21:26
 * @license MIT (see project's LICENSE file)
 *
 */

import * as _ from "lodash";
import {errorToFormatDetails} from "../format";
import {immutable} from "../mutation";
import {LogMessage, Severity, StackDescription, testSeverity} from "../types";


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
	public debug(message: LogMessage, {metadata, moduleId, stack, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		stack?: StackDescription,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.DEBUG,
			stack,
			traceId
		});
	}

	public error(message: LogMessage, {metadata, moduleId, stack, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		stack?: StackDescription,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.ERROR,
			stack,
			traceId
		});
	}

	public fatal(message: LogMessage, {metadata, moduleId, stack, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		stack?: StackDescription,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.FATAL,
			stack,
			traceId
		});
	}

	public info(message: LogMessage, {metadata, moduleId, stack, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		stack?: StackDescription,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.INFO,
			stack,
			traceId
		});
	}

	public warn(message: LogMessage, {metadata, moduleId, stack, traceId}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		stack?: StackDescription,
		traceId?: string
	}) {
		this._processEntry(message, {
			metadata,
			moduleId,
			severity: Severity.WARN,
			stack,
			traceId
		});
	}

	/**********************
	 * Protected Interface
	 *********************/
	/**
	 * This is where the rubber meets the road. Derived classes should hook this guy up
	 * to wherever the output needs to go.
	 */
	protected abstract _logEntry(message: string, severity: Severity, metadata: {[index: string]: any}): void;


	/*********************
	 * Private Interface
	 ********************/
	/**
	 * Processes the message and forwards it to `_logEntry`
	 * @private
	 */
	private _processEntry(message: LogMessage, {
		metadata,
		moduleId,
		severity,
		stack,
		traceId
	}: {
		metadata?: {[index: string]: any},
		moduleId: string,
		severity: Severity,
		stack?: StackDescription,
		traceId?: string
	}) {
		if(testSeverity(severity, this.threshold)) {
			if(typeof message === "function") {
				message = message();
			} else if(message instanceof Error) {
				const details = errorToFormatDetails(message, {
					details: true,
					stack: true
				});
				message = details.message;
				stack = stack || details.stack;
			}
			this._logEntry(message, severity, _.omitBy({
				applicationId: this.applicationId,
				environmentId: this.environmentId,
				metadata: (this.sortMetadata)
					? immutable.object.sort(metadata)
					: metadata,
				moduleId,
				severity,
				stack,
				timestamp: Date.now(),
				traceId
			}, _.isUndefined));
		}
	}
}
