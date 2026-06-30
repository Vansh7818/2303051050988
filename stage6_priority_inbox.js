/**
 * Stage 6 - Priority Inbox: Top-N Notifications
 *
 * Priority is determined by:
 *   1. Type weight: Placement (3) > Result (2) > Event (1)
 *   2. Recency: more recent = higher priority (using createdAt timestamp)
 *
 * Score formula:
 *   score = typeWeight * 1e13 + createdAt.getTime()
 *
 * A Max-Heap (size-bounded to N) is used to efficiently maintain
 * the top-N notifications as new ones stream in.
 */

// ─── Notification Type Weights ───────────────────────────────────────────────
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// ─── Score Function ───────────────────────────────────────────────────────────
function computeScore(notification) {
  const weight = TYPE_WEIGHT[notification.notificationType] ?? 0;
  const timestamp = new Date(notification.createdAt).getTime();
  // Multiply weight by a large constant so type always dominates,
  // then add timestamp so recency breaks ties within same type.
  return weight * 1e13 + timestamp;
}

// ─── Min-Heap (used internally to keep the TOP-N efficiently) ────────────────
// We use a min-heap of size N so we can quickly evict the lowest-priority item.
class MinHeap {
  constructor(compareFn) {
    this.data = [];
    this.compare = compareFn; // returns negative if a < b
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(item) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.data[i], this.data[parent]) < 0) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.compare(this.data[l], this.data[smallest]) < 0)
        smallest = l;
      if (r < n && this.compare(this.data[r], this.data[smallest]) < 0)
        smallest = r;
      if (smallest !== i) {
        [this.data[i], this.data[smallest]] = [
          this.data[smallest],
          this.data[i],
        ];
        i = smallest;
      } else break;
    }
  }
}

// ─── Priority Inbox ───────────────────────────────────────────────────────────
class PriorityInbox {
  /**
   * @param {number} n - Maximum number of top notifications to maintain
   */
  constructor(n = 10) {
    this.n = n;
    // Min-heap keyed by score: the root is always the LOWEST priority among top-N
    this.heap = new MinHeap((a, b) => a.score - b.score);
  }

  /**
   * Add a new notification. O(log N)
   * @param {Object} notification - { id, studentId, notificationType, message, createdAt, isRead }
   */
  addNotification(notification) {
    const score = computeScore(notification);
    const entry = { score, notification };

    if (this.heap.size() < this.n) {
      this.heap.push(entry);
    } else if (score > this.heap.peek().score) {
      // New notification is better than the worst in top-N → replace it
      this.heap.pop();
      this.heap.push(entry);
    }
    // Otherwise, the new notification doesn't make the top-N
  }

  /**
   * Get the top-N notifications sorted by priority (highest first). O(N log N)
   * @returns {Object[]}
   */
  getTopN() {
    // Extract all from heap and sort descending by score
    return [...this.heap.data]
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.notification);
  }
}

// ─── Demo / Test ─────────────────────────────────────────────────────────────
function runDemo() {
  console.log("=".repeat(60));
  console.log("  Stage 6 — Priority Inbox (Top 10 Notifications)");
  console.log("=".repeat(60));

  // Simulate a stream of 20 notifications
  const sampleNotifications = [
    {
      id: 1,
      studentId: 101,
      notificationType: "Event",
      message: "Freshers orientation on July 5",
      createdAt: "2026-06-20T08:00:00Z",
      isRead: false,
    },
    {
      id: 2,
      studentId: 101,
      notificationType: "Placement",
      message: "TCS drive scheduled for July 10",
      createdAt: "2026-06-21T09:00:00Z",
      isRead: false,
    },
    {
      id: 3,
      studentId: 101,
      notificationType: "Result",
      message: "Semester 4 results declared",
      createdAt: "2026-06-22T10:00:00Z",
      isRead: false,
    },
    {
      id: 4,
      studentId: 101,
      notificationType: "Placement",
      message: "Infosys walk-in on July 12",
      createdAt: "2026-06-23T11:00:00Z",
      isRead: false,
    },
    {
      id: 5,
      studentId: 101,
      notificationType: "Event",
      message: "Annual sports day on July 8",
      createdAt: "2026-06-18T07:00:00Z",
      isRead: false,
    },
    {
      id: 6,
      studentId: 101,
      notificationType: "Result",
      message: "Lab exam results out",
      createdAt: "2026-06-24T12:00:00Z",
      isRead: false,
    },
    {
      id: 7,
      studentId: 101,
      notificationType: "Placement",
      message: "Wipro recruitment portal open",
      createdAt: "2026-06-25T13:00:00Z",
      isRead: false,
    },
    {
      id: 8,
      studentId: 101,
      notificationType: "Event",
      message: "Hackathon 2026 registrations",
      createdAt: "2026-06-26T14:00:00Z",
      isRead: false,
    },
    {
      id: 9,
      studentId: 101,
      notificationType: "Result",
      message: "Project viva marks uploaded",
      createdAt: "2026-06-27T15:00:00Z",
      isRead: false,
    },
    {
      id: 10,
      studentId: 101,
      notificationType: "Placement",
      message: "Amazon SDE-1 drive – July 20",
      createdAt: "2026-06-28T16:00:00Z",
      isRead: false,
    },
    {
      id: 11,
      studentId: 101,
      notificationType: "Event",
      message: "Guest lecture by Dr. Sharma",
      createdAt: "2026-06-15T06:00:00Z",
      isRead: false,
    },
    {
      id: 12,
      studentId: 101,
      notificationType: "Result",
      message: "Internal marks finalized",
      createdAt: "2026-06-29T08:30:00Z",
      isRead: false,
    },
    {
      id: 13,
      studentId: 101,
      notificationType: "Placement",
      message: "Google internship applications open",
      createdAt: "2026-06-29T10:00:00Z",
      isRead: false,
    },
    {
      id: 14,
      studentId: 101,
      notificationType: "Event",
      message: "Cultural fest nominations",
      createdAt: "2026-06-10T09:00:00Z",
      isRead: false,
    },
    {
      id: 15,
      studentId: 101,
      notificationType: "Result",
      message: "Arrear results published",
      createdAt: "2026-06-17T11:00:00Z",
      isRead: false,
    },
    {
      id: 16,
      studentId: 101,
      notificationType: "Placement",
      message: "Microsoft campus drive – August 1",
      createdAt: "2026-06-30T07:00:00Z",
      isRead: false,
    },
    {
      id: 17,
      studentId: 101,
      notificationType: "Event",
      message: "Seminar on AI & ML",
      createdAt: "2026-06-30T08:00:00Z",
      isRead: false,
    },
    {
      id: 18,
      studentId: 101,
      notificationType: "Result",
      message: "Grade cards available for download",
      createdAt: "2026-06-30T09:00:00Z",
      isRead: false,
    },
    {
      id: 19,
      studentId: 101,
      notificationType: "Placement",
      message: "Accenture pool drive registration",
      createdAt: "2026-06-30T10:00:00Z",
      isRead: false,
    },
    {
      id: 20,
      studentId: 101,
      notificationType: "Placement",
      message: "Capgemini placement test – July 15",
      createdAt: "2026-06-30T11:00:00Z",
      isRead: false,
    },
  ];

  const inbox = new PriorityInbox(10);

  console.log("\n📥  Streaming notifications into Priority Inbox...\n");
  for (const notif of sampleNotifications) {
    inbox.addNotification(notif);
    console.log(
      `  Added [${notif.notificationType.padEnd(9)}] #${String(notif.id).padStart(2, "0")} — ${notif.message}`
    );
  }

  console.log("\n" + "─".repeat(60));
  console.log("  TOP 10 PRIORITY NOTIFICATIONS (highest priority first)");
  console.log("─".repeat(60));

  const top10 = inbox.getTopN();
  top10.forEach((notif, idx) => {
    const weight = TYPE_WEIGHT[notif.notificationType];
    console.log(
      `  ${String(idx + 1).padStart(2)}. [${notif.notificationType.padEnd(9)}] (weight=${weight}) ` +
        `| ${notif.createdAt.slice(0, 10)} | ${notif.message}`
    );
  });

  console.log("\n" + "─".repeat(60));
  console.log("  STREAMING NEW NOTIFICATION (adding 3 more)...");
  console.log("─".repeat(60));

  const newNotifs = [
    {
      id: 21,
      studentId: 101,
      notificationType: "Placement",
      message: "Deloitte final round interview – July 18",
      createdAt: "2026-06-30T14:00:00Z",
      isRead: false,
    },
    {
      id: 22,
      studentId: 101,
      notificationType: "Event",
      message: "Library book return deadline",
      createdAt: "2026-06-01T08:00:00Z",
      isRead: false,
    },
    {
      id: 23,
      studentId: 101,
      notificationType: "Result",
      message: "Semester 5 supplementary results",
      createdAt: "2026-06-30T14:30:00Z",
      isRead: false,
    },
  ];

  for (const notif of newNotifs) {
    inbox.addNotification(notif);
    console.log(
      `\n  ➕  New: [${notif.notificationType}] — ${notif.message}`
    );
  }

  console.log("\n  Updated TOP 10:\n");
  inbox.getTopN().forEach((notif, idx) => {
    const weight = TYPE_WEIGHT[notif.notificationType];
    console.log(
      `  ${String(idx + 1).padStart(2)}. [${notif.notificationType.padEnd(9)}] (weight=${weight}) ` +
        `| ${notif.createdAt.slice(0, 10)} | ${notif.message}`
    );
  });

  console.log("\n" + "=".repeat(60));
  console.log("  Time complexity: O(log N) per insert, O(N log N) for getTopN");
  console.log("  Space complexity: O(N) for the heap");
  console.log("=".repeat(60) + "\n");
}

runDemo();
