import type { RequestHandler } from 'express';
// import * as tasksService from './service';
import { Task, TaskStatus } from '@prisma/client';

interface task {
  id: number;
  projectId: number;
  assigneeId: number;
  title: string;
  description: string;
  tags: string[];
  startDate: string; // 'yyyy-mm-dd'
  endDate: string; // 'yyyy-mm-dd'
  files: string[];  // 예: 파일명 혹은 URL
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

let task: Task[] = [];
let nextId = 1;

// function isValidFileType(filename: string): boolean {
//   return /\.(png|jpg|jpeg|pdf)$/i.test(filename);
// }

function isValidDate(dateStr: string): boolean {
  // yyyy-mm-dd 형식 간단 검증
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

export const createTasks: RequestHandler = async (req, res) => {
  const { title, description, startYear, startMonth, startDay,
    endYear, endMonth, endDay, status, tags, attachments } = req.body

  const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  // 제목 검증
  if (!title || typeof title !== 'string' || title.length > 10) {
    return res.status(400).json({ message: '제목이 필요하고 10자 이내여야 합니다.' });
  }

  // 내용 검증
  if (!description || typeof description !== 'string' || description.length > 40) {
    return res.status(400).json({ message: '내용이 필요하고 40자 이내여야 합니다.' });
  }

  // 태그 검증
  if (!Array.isArray(tags) || tags.length > 5) {
    return res.status(400).json({ message: '최대 5개의 태그를 넣을 수 있습니다.' });
  }
  for (const tag of tags) {
    if (typeof tag !== 'string' || tag.length > 5) {
      return res.status(400).json({ message: '각각의 태그는 문자열 이어야하고 5자 이내여야 합니다.' });
    }
  }

  // 날짜 검증
  if (!startDate || !isValidDate(startDate)) {
    return res.status(400).json({ message: '시작날짜는 yyyy-mm-dd 형식으로 작성해주세요.' });
  }
  if (!endDate || !isValidDate(endDate)) {
    return res.status(400).json({ message: '마침날짜는 yyyy-mm-dd 형식으로 작성해주세요.' });
  }
  if (startDate > endDate) {
    return res.status(400).json({ message: '시작일자가 종료일자보다 늦을 수 없습니다.'})
  }

  // // 파일 첨부 검증
  // if (!Array.isArray(File) || File.length > 3) {
  //   return res.status(400).json({ message: 'Maximum 3 files allowed' });
  // }
  // for (const file of File) {
  //   if (typeof file !== 'string' || !isValidFileType(file)) {
  //     return res.status(400).json({ message: 'Allowed file types: PNG, JPG, PDF' });
  //   }
  // }

  const now = new Date();
  const projectId = req.body.projectId || 0;
  const assigneeId = req.body.assigneeId ?? null;
  const createdAt = now;
  const updatedAt = now;
  const timestamp: number = Date.parse(endDate);
  const dueDate: Date = new Date(timestamp);

  const id = nextId++;
  const newTask: task = {
    id,
    projectId,
    assigneeId,
    title,
    description,
    status,
    tags,
    startDate,
    endDate,
    createdAt,
    updatedAt,
    dueDate,
    files: []
  }
  task.push(newTask);  // tasks 배열에 새 할 일 객체 추가

  res.status(201).json(newTask);  // HTTP 201 Created 상태로 새 할 일 응답 전송
}


