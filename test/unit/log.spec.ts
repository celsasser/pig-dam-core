/**
 * Date: 2019-07-12
 * Time: 22:05
 * @license MIT (see project's LICENSE file)
 */

import {LogConsole, Severity} from "../../src";

describe("log.LogBase", function() {
	const defaults = {
		DATE: new Date("2020-01-01T00:00:00.000Z")
	};

	beforeEach(function() {
		global.console.debug = jest.fn();
		global.console.log = jest.fn();
		global.console.warn = jest.fn();
		global.console.error = jest.fn();
		global.Date.now = jest.fn().mockReturnValue(defaults.DATE);
	});

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
		{logMethod: Severity.DEBUG, consoleMethod: "debug"},
		{logMethod: Severity.INFO, consoleMethod: "log"},
		{logMethod: Severity.WARN, consoleMethod: "warn"},
		{logMethod: Severity.ERROR, consoleMethod: "error"},
		{logMethod: Severity.FATAL, consoleMethod: "error"}
	].forEach(({logMethod, consoleMethod}) => {
		describe(logMethod, function() {
			it(`should properly log "${logMethod}" to console.${consoleMethod}`, function() {
				const log = new LogConsole({
					applicationId: "applicationId",
					environmentId: "environmentId"
				});
				log[logMethod]("message", {
					metadata: {},
					moduleId: "moduleId",
					traceId: "traceId"
				});
				// @ts-ignore
				expect(console[consoleMethod]).toBeCalledWith("message", {
					"applicationId": "applicationId",
					"environmentId": "environmentId",
					"metadata": {},
					"moduleId": "moduleId",
					"severity": logMethod,
					"timestamp": defaults.DATE,
					"traceId": "traceId"
				});
			});
		});
	});

	[
		{logMethod: Severity.DEBUG, consoleMethod: "debug", logged: false},
		{logMethod: Severity.INFO, consoleMethod: "log", logged: true},
		{logMethod: Severity.WARN, consoleMethod: "warn", logged: true},
		{logMethod: Severity.ERROR, consoleMethod: "error", logged: true}
	].forEach(({logMethod, consoleMethod, logged}) => {
		describe(logMethod, function() {
			it(`should properly filter "${logMethod}" to console.${consoleMethod}`, function() {
				const log = new LogConsole({
					applicationId: "applicationId",
					environmentId: "environmentId",
					threshold: Severity.INFO
				});
				log[logMethod]("message", {
					metadata: {},
					moduleId: "moduleId",
					traceId: "traceId"
				});
				// @ts-ignore
				expect(console[consoleMethod]).toBeCalledTimes(logged ? 1 : 0);
			});
		});
	});
});
