(() => {
  const progress = document.querySelector('.page-progress');
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-menu a')];
  const menuToggle = document.querySelector('.menu-toggle');
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const detailDialog = document.querySelector('.detail-dialog');
  const detailDialogClose = detailDialog?.querySelector('.detail-dialog-close') || null;
  const detailKicker = detailDialog?.querySelector('.detail-dialog-kicker');
  const detailTitle = detailDialog?.querySelector('#detail-title');
  const detailSummary = detailDialog?.querySelector('.detail-dialog-summary');
  const detailGrid = detailDialog?.querySelector('.detail-dialog-grid');

  const moduleDetails = {
    capture: {
      kicker: '01 · Data Foundation',
      title: '动作采集 Motion Capture',
      summary: '以场景、角色和代表性行为为组织单元，建立可追溯的人体动作数据入口。',
      sections: [
        ['Input', ['动作策划、角色设定与采集任务清单', 'Xsens MVN Link 惯性动作捕捉系统']],
        ['Core Process', ['设备校准与实时骨骼预览', '按场景和行为执行多批次采集', '记录动作编号、批次和重采状态']],
        ['Output', ['经过初检的 Xsens 动作资产', '与任务语义对应的数据台账']],
        ['Engineering Focus', ['动作语义完整性', '传感器稳定性与连续性', '异常样本回溯和重采机制']]
      ]
    },
    'data-check': {
      kicker: '02 · Data Foundation',
      title: '回放与检查 Data Check',
      summary: '在进入 UE5 前完成动作级质量检查，避免异常数据沿 Pipeline 向后传播。',
      sections: [
        ['Input', ['完成采集的动作批次', '动作任务与编号记录']],
        ['Core Process', ['在 MVN 中回放骨骼动作', '核验动作语义、时序连续性和 root trajectory', '标记异常片段并关联原始批次']],
        ['Output', ['可进入 Retarget 的有效动作集合', '重采、保留与排除结果']],
        ['Engineering Focus', ['穿模或骨骼漂移', '动作起止段完整性', '批次命名和数据可追溯性']]
      ]
    },
    'ue5-retarget': {
      kicker: '03 · Data Foundation',
      title: 'UE5 重定向 UE5 Retarget',
      summary: '将 Xsens Skeleton 统一转换为 SMPL-H Skeleton，为后续 Python 数据处理建立稳定入口。',
      sections: [
        ['Input', ['通过质量检查的 Xsens FBX', 'Xsens Source Skeleton 与 SMPL-H Target Skeleton']],
        ['Core Process', ['配置 Source / Target IK Rig', '建立 Retarget Chain Mapping', '调整 Retarget Pose 并在 Asset Browser 中预览']],
        ['Output', ['重定向后的 Animation Sequence', '通过 Export / Bulk Export 输出的 SMPL-H FBX']],
        ['Engineering Focus', ['T-Pose 和骨架朝向对齐', 'spine、shoulder 与 limb chain 映射', 'root motion 与尺度一致性']]
      ]
    },
    processing: {
      kicker: '04 · Motion Intelligence',
      title: '数据处理 Data Processing',
      summary: '区分完整中间表示与正式算法表示，使格式解析、数据标准化和模型接口保持独立。',
      sections: [
        ['Input', ['UE5 导向后的 SMPL-H FBX', 'FBX 中的骨骼旋转、root translation 与时间信息']],
        ['Core Process', ['FBX → 完整 SMPL-H PKL，中间保留 52-joint axis-angle', '坐标系重置、落地与原点归一化', '选择 22 个 body joints 并转换为 Rot6D']],
        ['Output', ['20 FPS 标准动作序列', '[T,135] = root translation 3 + 22 joints × Rot6D']],
        ['Engineering Focus', ['从 FBX 读取实际 source FPS', 'rotation 与 translation 同步重采样', 'PKL 作为可复用和可排查的中间检查点']]
      ]
    },
    generation: {
      kicker: '05 · Motion Intelligence',
      title: '动作生成 StableMoFusion',
      summary: '以自然语言描述驱动人体动作生成，并让 GT 与 generated motion 共用同一数据接口。',
      sections: [
        ['Input', ['Text Prompt / Caption', '20 FPS、[T,135] 标准训练动作']],
        ['Core Process', ['StableMoFusion Text-to-Motion 训练与推理', '支持 batch inference', '生成结果接入统一 motion loader 与可视化流程']],
        ['Output', ['与文本语义对应的动作序列', '可直接进入 Evaluator 和机器人链路的标准表示']],
        ['Engineering Focus', ['生成动作与 GT 的接口一致性', '时序长度和动作表示统一', '推理结果的批量管理与回放验证']]
      ]
    },
    evaluator: {
      kicker: '06 · Human-aligned Evaluation',
      title: 'Human Preference Evaluator',
      summary: '把人的动作感知转化为可学习的偏好信号，从语义匹配和动作自然性两个维度评价生成结果。',
      sections: [
        ['Input', ['Text Prompt 与候选动作', '人工比较与偏好标注结果']],
        ['Core Process', ['Match：文本语义与动作完成度', 'Smooth：动作连续性与自然程度', '将偏好结果组织为 pairwise ranking supervision']],
        ['Output', ['候选动作质量分数与排序', '面向生成模型选择和比较的 Human-aligned 指标']],
        ['Engineering Focus', ['统一 Blender 骨骼视频呈现', '减少标注条件差异', '自动评价与人工判断的一致性']]
      ]
    },
    simulation: {
      kicker: '07 · Embodied Deployment',
      title: '机器人仿真 Robot Simulation',
      summary: '将标准人体动作转换为 G1 reference，并通过闭环强化学习获得兼顾动作跟踪与平衡的控制策略。',
      sections: [
        ['Input', ['RoleMotion 标准人体动作', 'SMPL-H Forward 后的人体关节姿态']],
        ['Core Process', ['GMR 将人体动作重定向为 Unitree G1 29-DoF reference', 'HoloMotion / Isaac Lab 构建 observation、action、reward、reset 与 termination', '使用 PPO 训练 reference motion tracking policy']],
        ['Output', ['可稳定跟踪多种参考动作的策略', '用于 Sim2Real 的策略模型与验证结果']],
        ['Engineering Focus', ['joint order、坐标轴与 root height 对齐', 'reference 频率与控制频率插值', 'tracking 精度与 balance 稳定性的权衡', 'friction、noise、offset 与 external push 随机化']]
      ]
    },
    deployment: {
      kicker: '08 · Embodied Deployment',
      title: 'Unitree G1 Deployment',
      summary: '把仿真策略接入真实机器人控制链路，通过渐进式安全测试完成 Sim2Real 验证。',
      sections: [
        ['Input', ['训练完成并导出的 ONNX policy', 'G1 reference motion 与机器人状态']],
        ['Core Process', ['ROS2 / Unitree SDK 读取状态并执行策略', '将 policy action 转换为 target q', '使用 PD Control 驱动关节跟踪']],
        ['Output', ['Unitree G1 实机动作执行', '舞蹈、对话手势等代表性动作验证']],
        ['Engineering Focus', ['sim / real joint mapping 与 zero offset', '传感噪声、控制延迟和动力学差异', '吊装、zero torque、站立到完整动作的渐进测试']]
      ]
    }
  };

  const openModuleDetails = (key) => {
    const details = moduleDetails[key];
    if (!details || !detailDialog || !detailGrid) return;

    detailKicker.textContent = details.kicker;
    detailTitle.textContent = details.title;
    detailSummary.textContent = details.summary;
    detailGrid.innerHTML = details.sections.map(([heading, items]) => `
      <section class="detail-block">
        <h3>${heading}</h3>
        <ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>
      </section>
    `).join('');

    document.body.classList.add('modal-open');
    detailDialog.showModal();
    detailDialogClose?.focus();
  };

  document.querySelectorAll('[data-module-detail]').forEach((button) => {
    button.addEventListener('click', () => openModuleDetails(button.dataset.moduleDetail));
  });

  detailDialogClose?.addEventListener('click', () => detailDialog.close());
  detailDialog?.addEventListener('click', (event) => {
    const bounds = detailDialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) detailDialog.close();
  });
  detailDialog?.addEventListener('close', () => document.body.classList.remove('modal-open'));

  const setProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const setActiveLink = () => {
    const offset = (header?.offsetHeight || 76) + 80;
    let current = sections[0]?.id || 'home';

    sections.forEach((section) => {
      if (section.offsetTop <= window.scrollY + offset) current = section.id;
    });

    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', '打开导航');
  };

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    menuToggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px' }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });

  const openLightbox = (source, alt) => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = source;
    lightboxImage.alt = alt || '项目图片预览';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lightboxImage.src = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      const source = button.dataset.lightbox;
      const alt = button.closest('.module-media')?.querySelector('img')?.alt;
      openLightbox(source, alt);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      setProgress();
      setActiveLink();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
    setProgress();
  });

  setProgress();
  setActiveLink();
})();
