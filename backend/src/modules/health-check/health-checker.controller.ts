import { MB, GB, MILISECOND } from '../../common/constants/util';
import { Controller, Get } from '@nestjs/common';
import os from 'os';
import { default as dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';

@Controller('health')
export class HealthCheckerController {
	private readonly now = Date.now();
	private readonly none = 'none';

	@Get()
	async healCheck() {
		const { freemem, totalmem, cpus } = os;
		const numConfig = 100;

		// TODO: get free memmory and total memmory
		const freeMem = Math.floor(freemem() / MB) / (numConfig * 10);
		const totalMem = Math.floor(totalmem() / GB);
		const usedMemPercent = (totalmem() - freemem()) / totalmem();
		const used = (usedMemPercent * numConfig).toFixed(2);

		// TODO: get idle cpu cores
		const { user, system } = process.cpuUsage();
		const cpuUsed = Math.floor((system / user) * numConfig);

		// TODO: convert uptime hh:mm:ss
		const uptime = process.uptime();
		dayjs.extend(duration);
		const formatted = dayjs.duration(uptime * MILISECOND, 'milliseconds').format('H[h] m[m] s[s]');

		// TODO: create healcheck info
		const { model, speed } = cpus()[0];
		const healcheck = {
			uptime: formatted,
			cpus: {
				model: model || this.none,
				speed: `${speed}MHz` || this.none,
				cores: `${cpus().length} cores`,
				used: `${cpuUsed}%`,
			},
			mem: {
				swap: `${(totalMem - freeMem).toFixed(2)}GB/${totalMem}GB`,
				used: `${used}%`,
			},
			message: 'OK',
			timestamp: dayjs(Date.now()).format('YYYY/MM/DD - HH:mm:ss'),
		};
		try {
			return healcheck;
		} catch (e) {
			healcheck.message = e;
			return healcheck;
		}
	}
}
