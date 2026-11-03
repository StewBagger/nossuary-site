//#region node_modules/@protobuf-ts/runtime/build/es2015/binary-format-contract.js
/**
* This handler implements the default behaviour for unknown fields.
* When reading data, unknown fields are stored on the message, in a
* symbol property.
* When writing data, the symbol property is queried and unknown fields
* are serialized into the output again.
*/
var UnknownFieldHandler;
(function(UnknownFieldHandler) {
	/**
	* The symbol used to store unknown fields for a message.
	* The property must conform to `UnknownFieldContainer`.
	*/
	UnknownFieldHandler.symbol = Symbol.for("protobuf-ts/unknown");
	/**
	* Store an unknown field during binary read directly on the message.
	* This method is compatible with `BinaryReadOptions.readUnknownField`.
	*/
	UnknownFieldHandler.onRead = (typeName, message, fieldNo, wireType, data) => {
		(is(message) ? message[UnknownFieldHandler.symbol] : message[UnknownFieldHandler.symbol] = []).push({
			no: fieldNo,
			wireType,
			data
		});
	};
	/**
	* Write unknown fields stored for the message to the writer.
	* This method is compatible with `BinaryWriteOptions.writeUnknownFields`.
	*/
	UnknownFieldHandler.onWrite = (typeName, message, writer) => {
		for (let { no, wireType, data } of UnknownFieldHandler.list(message)) writer.tag(no, wireType).raw(data);
	};
	/**
	* List unknown fields stored for the message.
	* Note that there may be multiples fields with the same number.
	*/
	UnknownFieldHandler.list = (message, fieldNo) => {
		if (is(message)) {
			let all = message[UnknownFieldHandler.symbol];
			return fieldNo ? all.filter((uf) => uf.no == fieldNo) : all;
		}
		return [];
	};
	/**
	* Returns the last unknown field by field number.
	*/
	UnknownFieldHandler.last = (message, fieldNo) => UnknownFieldHandler.list(message, fieldNo).slice(-1)[0];
	const is = (message) => message && Array.isArray(message[UnknownFieldHandler.symbol]);
})(UnknownFieldHandler || (UnknownFieldHandler = {}));
/**
* Protobuf binary format wire types.
*
* A wire type provides just enough information to find the length of the
* following value.
*
* See https://developers.google.com/protocol-buffers/docs/encoding#structure
*/
var WireType;
(function(WireType) {
	/**
	* Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
	*/
	WireType[WireType["Varint"] = 0] = "Varint";
	/**
	* Used for fixed64, sfixed64, double.
	* Always 8 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit64"] = 1] = "Bit64";
	/**
	* Used for string, bytes, embedded messages, packed repeated fields
	*
	* Only repeated numeric types (types which use the varint, 32-bit,
	* or 64-bit wire types) can be packed. In proto3, such fields are
	* packed by default.
	*/
	WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
	/**
	* Used for groups
	* @deprecated
	*/
	WireType[WireType["StartGroup"] = 3] = "StartGroup";
	/**
	* Used for groups
	* @deprecated
	*/
	WireType[WireType["EndGroup"] = 4] = "EndGroup";
	/**
	* Used for fixed32, sfixed32, float.
	* Always 4 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
//#endregion
//#region node_modules/@protobuf-ts/runtime/build/es2015/goog-varint.js
/**
* Read a 64 bit varint as two JS numbers.
*
* Returns tuple:
* [0]: low bits
* [0]: high bits
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
*/
function varint64read() {
	let lowBits = 0;
	let highBits = 0;
	for (let shift = 0; shift < 28; shift += 7) {
		let b = this.buf[this.pos++];
		lowBits |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.assertBounds();
			return [lowBits, highBits];
		}
	}
	let middleByte = this.buf[this.pos++];
	lowBits |= (middleByte & 15) << 28;
	highBits = (middleByte & 112) >> 4;
	if ((middleByte & 128) == 0) {
		this.assertBounds();
		return [lowBits, highBits];
	}
	for (let shift = 3; shift <= 31; shift += 7) {
		let b = this.buf[this.pos++];
		highBits |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.assertBounds();
			return [lowBits, highBits];
		}
	}
	throw new Error("invalid varint");
}
var TWO_PWR_32_DBL$1 = 4294967296;
/**
* Parse decimal string of 64 bit integer value as two JS numbers.
*
* Returns tuple:
* [0]: minus sign?
* [1]: low bits
* [2]: high bits
*
* Copyright 2008 Google Inc.
*/
function int64fromString(dec) {
	let minus = dec[0] == "-";
	if (minus) dec = dec.slice(1);
	const base = 1e6;
	let lowBits = 0;
	let highBits = 0;
	function add1e6digit(begin, end) {
		const digit1e6 = Number(dec.slice(begin, end));
		highBits *= base;
		lowBits = lowBits * base + digit1e6;
		if (lowBits >= TWO_PWR_32_DBL$1) {
			highBits = highBits + (lowBits / TWO_PWR_32_DBL$1 | 0);
			lowBits = lowBits % TWO_PWR_32_DBL$1;
		}
	}
	add1e6digit(-24, -18);
	add1e6digit(-18, -12);
	add1e6digit(-12, -6);
	add1e6digit(-6);
	return [
		minus,
		lowBits,
		highBits
	];
}
/**
* Format 64 bit integer value (as two JS numbers) to decimal string.
*
* Copyright 2008 Google Inc.
*/
function int64toString(bitsLow, bitsHigh) {
	if (bitsHigh >>> 0 <= 2097151) return "" + (TWO_PWR_32_DBL$1 * bitsHigh + (bitsLow >>> 0));
	let low = bitsLow & 16777215;
	let mid = (bitsLow >>> 24 | bitsHigh << 8) >>> 0 & 16777215;
	let high = bitsHigh >> 16 & 65535;
	let digitA = low + mid * 6777216 + high * 6710656;
	let digitB = mid + high * 8147497;
	let digitC = high * 2;
	let base = 1e7;
	if (digitA >= base) {
		digitB += Math.floor(digitA / base);
		digitA %= base;
	}
	if (digitB >= base) {
		digitC += Math.floor(digitB / base);
		digitB %= base;
	}
	function decimalFrom1e7(digit1e7, needLeadingZeros) {
		let partial = digit1e7 ? String(digit1e7) : "";
		if (needLeadingZeros) return "0000000".slice(partial.length) + partial;
		return partial;
	}
	return decimalFrom1e7(digitC, 0) + decimalFrom1e7(digitB, digitC) + decimalFrom1e7(digitA, 1);
}
/**
* Read an unsigned 32 bit varint.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
*/
function varint32read() {
	let b = this.buf[this.pos++];
	let result = b & 127;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 7;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 14;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 21;
	if ((b & 128) == 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 15) << 28;
	for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++) b = this.buf[this.pos++];
	if ((b & 128) != 0) throw new Error("invalid varint");
	this.assertBounds();
	return result >>> 0;
}
//#endregion
//#region node_modules/@protobuf-ts/runtime/build/es2015/pb-long.js
var BI;
function detectBi() {
	const dv = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
	BI = globalThis.BigInt !== void 0 && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" ? {
		MIN: BigInt("-9223372036854775808"),
		MAX: BigInt("9223372036854775807"),
		UMIN: BigInt("0"),
		UMAX: BigInt("18446744073709551615"),
		C: BigInt,
		V: dv
	} : void 0;
}
detectBi();
function assertBi(bi) {
	if (!bi) throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
}
var RE_DECIMAL_STR = /^-?[0-9]+$/;
var TWO_PWR_32_DBL = 4294967296;
var HALF_2_PWR_32 = 2147483648;
var SharedPbLong = class {
	/**
	* Create a new instance with the given bits.
	*/
	constructor(lo, hi) {
		this.lo = lo | 0;
		this.hi = hi | 0;
	}
	/**
	* Is this instance equal to 0?
	*/
	isZero() {
		return this.lo == 0 && this.hi == 0;
	}
	/**
	* Convert to a native number.
	*/
	toNumber() {
		let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0);
		if (!Number.isSafeInteger(result)) throw new Error("cannot convert to safe number");
		return result;
	}
};
/**
* 64-bit unsigned integer as two 32-bit values.
* Converts between `string`, `number` and `bigint` representations.
*/
var PbULong = class PbULong extends SharedPbLong {
	/**
	* Create instance from a `string`, `number` or `bigint`.
	*/
	static from(value) {
		if (BI) switch (typeof value) {
			case "string":
				if (value == "0") return this.ZERO;
				if (value == "") throw new Error("string is no integer");
				value = BI.C(value);
			case "number":
				if (value === 0) return this.ZERO;
				value = BI.C(value);
			case "bigint":
				if (!value) return this.ZERO;
				if (value < BI.UMIN) throw new Error("signed value for ulong");
				if (value > BI.UMAX) throw new Error("ulong too large");
				BI.V.setBigUint64(0, value, true);
				return new PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
		}
		else switch (typeof value) {
			case "string":
				if (value == "0") return this.ZERO;
				value = value.trim();
				if (!RE_DECIMAL_STR.test(value)) throw new Error("string is no integer");
				let [minus, lo, hi] = int64fromString(value);
				if (minus) throw new Error("signed value for ulong");
				return new PbULong(lo, hi);
			case "number":
				if (value == 0) return this.ZERO;
				if (!Number.isSafeInteger(value)) throw new Error("number is no integer");
				if (value < 0) throw new Error("signed value for ulong");
				return new PbULong(value, value / TWO_PWR_32_DBL);
		}
		throw new Error("unknown value " + typeof value);
	}
	/**
	* Convert to decimal string.
	*/
	toString() {
		return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi);
	}
	/**
	* Convert to native bigint.
	*/
	toBigInt() {
		assertBi(BI);
		BI.V.setInt32(0, this.lo, true);
		BI.V.setInt32(4, this.hi, true);
		return BI.V.getBigUint64(0, true);
	}
};
/**
* ulong 0 singleton.
*/
PbULong.ZERO = new PbULong(0, 0);
/**
* 64-bit signed integer as two 32-bit values.
* Converts between `string`, `number` and `bigint` representations.
*/
var PbLong = class PbLong extends SharedPbLong {
	/**
	* Create instance from a `string`, `number` or `bigint`.
	*/
	static from(value) {
		if (BI) switch (typeof value) {
			case "string":
				if (value == "0") return this.ZERO;
				if (value == "") throw new Error("string is no integer");
				value = BI.C(value);
			case "number":
				if (value === 0) return this.ZERO;
				value = BI.C(value);
			case "bigint":
				if (!value) return this.ZERO;
				if (value < BI.MIN) throw new Error("signed long too small");
				if (value > BI.MAX) throw new Error("signed long too large");
				BI.V.setBigInt64(0, value, true);
				return new PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
		}
		else switch (typeof value) {
			case "string":
				if (value == "0") return this.ZERO;
				value = value.trim();
				if (!RE_DECIMAL_STR.test(value)) throw new Error("string is no integer");
				let [minus, lo, hi] = int64fromString(value);
				if (minus) {
					if (hi > HALF_2_PWR_32 || hi == HALF_2_PWR_32 && lo != 0) throw new Error("signed long too small");
				} else if (hi >= HALF_2_PWR_32) throw new Error("signed long too large");
				let pbl = new PbLong(lo, hi);
				return minus ? pbl.negate() : pbl;
			case "number":
				if (value == 0) return this.ZERO;
				if (!Number.isSafeInteger(value)) throw new Error("number is no integer");
				return value > 0 ? new PbLong(value, value / TWO_PWR_32_DBL) : new PbLong(-value, -value / TWO_PWR_32_DBL).negate();
		}
		throw new Error("unknown value " + typeof value);
	}
	/**
	* Do we have a minus sign?
	*/
	isNegative() {
		return (this.hi & HALF_2_PWR_32) !== 0;
	}
	/**
	* Negate two's complement.
	* Invert all the bits and add one to the result.
	*/
	negate() {
		let hi = ~this.hi, lo = this.lo;
		if (lo) lo = ~lo + 1;
		else hi += 1;
		return new PbLong(lo, hi);
	}
	/**
	* Convert to decimal string.
	*/
	toString() {
		if (BI) return this.toBigInt().toString();
		if (this.isNegative()) {
			let n = this.negate();
			return "-" + int64toString(n.lo, n.hi);
		}
		return int64toString(this.lo, this.hi);
	}
	/**
	* Convert to native bigint.
	*/
	toBigInt() {
		assertBi(BI);
		BI.V.setInt32(0, this.lo, true);
		BI.V.setInt32(4, this.hi, true);
		return BI.V.getBigInt64(0, true);
	}
};
/**
* long 0 singleton.
*/
PbLong.ZERO = new PbLong(0, 0);
//#endregion
//#region node_modules/@protobuf-ts/runtime/build/es2015/binary-reader.js
var BinaryReader = class {
	constructor(buf, textDecoder) {
		this.varint64 = varint64read;
		/**
		* Read a `uint32` field, an unsigned 32 bit varint.
		*/
		this.uint32 = varint32read;
		this.buf = buf;
		this.len = buf.length;
		this.pos = 0;
		this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
		this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
	}
	/**
	* Reads a tag - field number and wire type.
	*/
	tag() {
		let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
		if (fieldNo <= 0 || wireType < 0 || wireType > 5) throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
		return [fieldNo, wireType];
	}
	/**
	* Skip one element on the wire and return the skipped data.
	* Supports WireType.StartGroup since v2.0.0-alpha.23.
	*/
	skip(wireType) {
		let start = this.pos;
		switch (wireType) {
			case WireType.Varint:
				while (this.buf[this.pos++] & 128);
				break;
			case WireType.Bit64: this.pos += 4;
			case WireType.Bit32:
				this.pos += 4;
				break;
			case WireType.LengthDelimited:
				let len = this.uint32();
				this.pos += len;
				break;
			case WireType.StartGroup:
				let t;
				while ((t = this.tag()[1]) !== WireType.EndGroup) this.skip(t);
				break;
			default: throw new Error("cant skip wire type " + wireType);
		}
		this.assertBounds();
		return this.buf.subarray(start, this.pos);
	}
	/**
	* Throws error if position in byte array is out of range.
	*/
	assertBounds() {
		if (this.pos > this.len) throw new RangeError("premature EOF");
	}
	/**
	* Read a `int32` field, a signed 32 bit varint.
	*/
	int32() {
		return this.uint32() | 0;
	}
	/**
	* Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
	*/
	sint32() {
		let zze = this.uint32();
		return zze >>> 1 ^ -(zze & 1);
	}
	/**
	* Read a `int64` field, a signed 64-bit varint.
	*/
	int64() {
		return new PbLong(...this.varint64());
	}
	/**
	* Read a `uint64` field, an unsigned 64-bit varint.
	*/
	uint64() {
		return new PbULong(...this.varint64());
	}
	/**
	* Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
	*/
	sint64() {
		let [lo, hi] = this.varint64();
		let s = -(lo & 1);
		lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
		hi = hi >>> 1 ^ s;
		return new PbLong(lo, hi);
	}
	/**
	* Read a `bool` field, a variant.
	*/
	bool() {
		let [lo, hi] = this.varint64();
		return lo !== 0 || hi !== 0;
	}
	/**
	* Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
	*/
	fixed32() {
		return this.view.getUint32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
	*/
	sfixed32() {
		return this.view.getInt32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
	*/
	fixed64() {
		return new PbULong(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `fixed64` field, a signed, fixed-length 64-bit integer.
	*/
	sfixed64() {
		return new PbLong(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `float` field, 32-bit floating point number.
	*/
	float() {
		return this.view.getFloat32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `double` field, a 64-bit floating point number.
	*/
	double() {
		return this.view.getFloat64((this.pos += 8) - 8, true);
	}
	/**
	* Read a `bytes` field, length-delimited arbitrary data.
	*/
	bytes() {
		let len = this.uint32();
		let start = this.pos;
		this.pos += len;
		this.assertBounds();
		return this.buf.subarray(start, start + len);
	}
	/**
	* Read a `string` field, length-delimited data converted to UTF-8 text.
	*/
	string() {
		return this.textDecoder.decode(this.bytes());
	}
};
//#endregion
//#region ui/worker/types.ts
/**
* API endpoints and exposed wasm function names. Also used as request identifier.
*/
var SimRequest = /* @__PURE__ */ function(SimRequest) {
	SimRequest["computeStats"] = "computeStats";
	SimRequest["computeStatsJson"] = "computeStatsJson";
	SimRequest["reforgeOptimizeAsync"] = "reforgeOptimizeAsync";
	SimRequest["raidSim"] = "raidSim";
	SimRequest["raidSimJson"] = "raidSimJson";
	SimRequest["raidSimAsync"] = "raidSimAsync";
	SimRequest["bulkSimAsync"] = "bulkSimAsync";
	SimRequest["bulkCombinationCount"] = "bulkCombinationCount";
	SimRequest["bulkCandidates"] = "bulkCandidates";
	SimRequest["statWeights"] = "statWeights";
	SimRequest["statWeightsAsync"] = "statWeightsAsync";
	SimRequest["statWeightRequests"] = "statWeightRequests";
	SimRequest["statWeightCompute"] = "statWeightCompute";
	SimRequest["statWeightTopUpPlan"] = "statWeightTopUpPlan";
	SimRequest["raidSimRequestSplit"] = "raidSimRequestSplit";
	SimRequest["raidSimResultCombination"] = "raidSimResultCombination";
	SimRequest["levelDefaults"] = "levelDefaults";
	SimRequest["bisGear"] = "bisGear";
	SimRequest["abortById"] = "abortById";
	SimRequest["simlParse"] = "simlParse";
	SimRequest["simlPrint"] = "simlPrint";
	return SimRequest;
}({});
var ASYNC_SIM_REQUESTS = [
	"raidSimAsync",
	"statWeightsAsync",
	"bulkSimAsync",
	"reforgeOptimizeAsync"
];
//#endregion
//#region ui/worker/utils.ts
var noop = () => {};
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
//#endregion
//#region ui/worker/worker_interface.ts
/**
* Communication with the UI.
*/
var WorkerInterface = class {
	constructor(handlers) {
		this._workerId = "";
		this.handlers = handlers;
		addEventListener("message", async ({ data }) => {
			if (data.msg === "wasmModule") return;
			const { id, msg, inputData } = data;
			if (msg === "setID") {
				this._workerId = id;
				this.postMessage({ msg: "idConfirm" });
				return;
			}
			const handlerFunc = this.handlers?.[msg];
			if (!handlerFunc) {
				console.error(`Request msg: ${msg}, id: ${id}, is not handled!`);
				this.postMessage({
					msg,
					id,
					outputData: /* @__PURE__ */ new Uint8Array()
				});
				return;
			}
			const progressCallback = (prog) => {
				this.postMessage({
					msg: "progress",
					id: `${id}progress`,
					outputData: prog
				});
			};
			try {
				const outputData = await handlerFunc(inputData, progressCallback, id, msg);
				this.postMessage({
					msg,
					id,
					outputData
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				console.error(errorMessage);
				this.postMessage({
					msg,
					id,
					outputData: /* @__PURE__ */ new Uint8Array(),
					error: errorMessage
				});
			}
		});
	}
	postMessage(m) {
		postMessage(m);
	}
	get workerId() {
		return this._workerId;
	}
	/**
	* Tell UI that the worker is ready.
	* @param isWasm true if worker is using wasm.
	*/
	ready(isWasm) {
		this.postMessage({
			msg: "ready",
			outputData: new Uint8Array([+isWasm])
		});
	}
};
//#endregion
//#region ui/worker/worker_http.ts
var defaultRequestOptions = {
	method: "POST",
	headers: { "Content-Type": "application/x-protobuf" }
};
var FINAL_PROGRESS_FIELDS = /* @__PURE__ */ new Set([
	6,
	7,
	10,
	11
]);
var isFinalProgress = (progressMetrics) => {
	const reader = new BinaryReader(progressMetrics);
	while (reader.pos < reader.len) {
		const [fieldNo, wireType] = reader.tag();
		if (FINAL_PROGRESS_FIELDS.has(fieldNo)) return true;
		reader.skip(wireType);
	}
	return false;
};
var setupHttpWorker = (baseURL) => {
	const makeHttpApiRequest = (endPoint, inputData, requestId) => fetch(`${baseURL}/${endPoint}?requestId=${requestId}`, {
		...defaultRequestOptions,
		body: inputData
	});
	const readHttpApiResponse = async (response, endPoint) => {
		if (!response.ok) {
			const body = await response.text();
			throw new Error(`HTTP ${response.status} from /${endPoint}: ${body.slice(0, 200)}`);
		}
		const ab = await response.arrayBuffer();
		return new Uint8Array(ab);
	};
	const syncHandler = async (inputData, _, id, msg) => {
		const response = await makeHttpApiRequest(msg, inputData, id);
		return readHttpApiResponse(response, msg);
	};
	const asyncHandler = async (inputData, progress, id, msg) => {
		const asyncApiResult = await syncHandler(inputData, noop, id, msg);
		let outputData = /* @__PURE__ */ new Uint8Array();
		while (true) {
			const progressResponse = await makeHttpApiRequest("asyncProgress", asyncApiResult, id);
			if ([204, 404].includes(progressResponse.status)) break;
			outputData = await readHttpApiResponse(progressResponse, "asyncProgress");
			progress(outputData);
			if (isFinalProgress(outputData)) break;
			await sleep(50);
		}
		return outputData;
	};
	const noWasmConcurrency = (_, __, msg) => {
		const errmsg = `Tried to use ${msg} while using a http worker! This is only supported for wasm!`;
		console.error(errmsg);
		return /* @__PURE__ */ new Uint8Array();
	};
	const handlers = Object.fromEntries(Object.values(SimRequest).map((request) => [request, ASYNC_SIM_REQUESTS.includes(request) ? asyncHandler : syncHandler]));
	handlers[SimRequest.raidSimRequestSplit] = noWasmConcurrency;
	handlers[SimRequest.raidSimResultCombination] = noWasmConcurrency;
	new WorkerInterface(handlers).ready(false);
};
//#endregion
//#region ui/worker/local_worker.ts
setupHttpWorker("http://localhost:3333");
//#endregion
