/**
 * Date: 2019-07-12
 * Time: 22:05
 * @license MIT (see project's LICENSE file)
 */

import {LogConsole, Severity} from "../../src";

describe("log.LogBase", function() {
	describe("constructor", function() {
		it("should properly create the instance", function() {
			const log = new LogConsole({
				applicationId: "applicationId",
				environmentId: "environmentId",
				sortMetadata: true,
				threshold: Severity.WARN
			});
			expect(log.applicationId).toEqual("applicationId");
			expect(log.environmentId).toEqual("environmentId");
			expect(log.sortMetadata).toEqual(true);
			expect(log.threshold).toEqual(Severity.WARN);
		});
	});

	[
		["debug", Severity.DEBUG],
		["error", Severity.ERROR],
		["fatal", Severity.FATAL],
		["info", Severity.INFO],
		["warn", Severity.WARN]
	].forEach(([method, _severity]) => {
		describe(method, function() {
			it(`should properly call _processEntry with severity="${_severity}" and proper param values`, function() {
				const log = new LogConsole({
					applicationId: "applicationId",
					environmentId: "environmentId"
				});
				proxy.stub(log, "_processEntry", function(message, {
					metadata,
					moduleId,
					severity,
					traceId
				}) {
					expect(message).toEqual("message");
					expect(metadata).toEqual("metadata");
					expect(moduleId).toEqual("moduleId");
					expect(severity).toEqual(_severity);
					expect(traceId).toEqual("traceId");
				});
				log[method]("message", {
					metadata: "metadata",
					moduleId: "moduleId",
					traceId: "traceId"
				});
				expect(log._processEntry.callCount).toEqual(1);
			});
		});
	});

	describe("_processEntry", function() {
		[
			Severity.DEBUG,
			Severity.ERROR,
			Severity.FATAL,
			Severity.INFO,
			Severity.WARN
		].forEach(severity => {
			it(`should process ${severity} if no threshold is specified and call _processEntry with proper arguments`, function() {
				const log = new LogConsole({
					applicationId: "applicationId",
					environmentId: "environmentId"
				});
				const timestamp = new Date("2000-01-01T00:00:00.000Z");
				proxy.stubDate(timestamp);
				proxy.stub(log, "_logEntry", function(message, metadata) {
					expect(message).toEqual("message");
					expect(metadata).toEqual({
						applicationId: "applicationId",
						environmentId: "environmentId",
						moduleId: "moduleId",
						severity,
						timestamp,
						traceId: "traceId"
					});
				});
				log._processEntry("message", {
					moduleId: "moduleId",
					severity,
					traceId: "traceId"
				});
				expect(log._logEntry.callCount).toEqual(1);
			});
		});

		[
			[Severity.DEBUG, false],
			[Severity.INFO, false],
			[Severity.WARN, true],
			[Severity.ERROR, true],
			[Severity.FATAL, true]
		].forEach(([_severity, process]) => {
			it(`should properly ${process ? "process" : "bypass"} if severity=${_severity} and threshold=${Severity.WARN}`, function() {
				const log = new LogConsole({
					applicationId: "applicationId",
					environmentId: "environmentId",
					threshold: Severity.WARN
				});
				proxy.spy(log, "_logEntry");
				log._processEntry("message", {
					moduleId: "moduleId",
					severity: _severity
				});
				expect(log._logEntry.callCount).toEqual((process) ? 1 : 0);
			});
		});

		it("should sort metadata properties if asked to", function() {
			const log = new LogConsole({
				applicationId: "applicationId",
				environmentId: "environmentId",
				sortMetadata: true
			});
			const timestamp = new Date("2000-01-01T00:00:00.000Z");
			proxy.stubDate(timestamp);
			proxy.stub(log, "_logEntry", function(message, metadata) {
				expect(metadata).toEqual({
					applicationId: "applicationId",
					environmentId: "environmentId",
					metadata: {
						"a": 1,
						"b": 2
					},
					moduleId: "moduleId",
					severity: "severity",
					timestamp
				});
			});
			log._processEntry("message", {
				metadata: {
					b: 2,
					a: 1
				},
				moduleId: "moduleId",
				severity: "severity"
			});
		});

		it("should not sort metadata properties if not asked to", function() {
			const log = new LogConsole({
				applicationId: "applicationId",
				environmentId: "environmentId",
				sortMetadata: false
			});
			const timestamp = new Date("2000-01-01T00:00:00.000Z");
			proxy.stubDate(timestamp);
			proxy.stub(log, "_logEntry", function(message, metadata) {
				expect(metadata).toEqual({
					applicationId: "applicationId",
					environmentId: "environmentId",
					metadata: {
						"b": 2,
						"a": 1
					},
					moduleId: "moduleId",
					severity: "severity",
					timestamp
				});
			});
			log._processEntry("message", {
				metadata: {
					b: 2,
					a: 1
				},
				moduleId: "moduleId",
				severity: "severity"
			});
		});
	});
});
